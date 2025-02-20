import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      agent {
        id
        email
        role
      }
    }
  }
`;
export const GET_PROFILE_QUERY = gql`
  query {
    getProfile {
      id
      email
      firstName
      lastName
      phoneNumber
      npnNumber
      licenseNo
      webhook_url
      role
      globalCap
      monthlyCap
      dailyCap
      remainingCap
      priority
      weight
      policies {
        id
        name
      }
      locations {
        id
        name
      }
    }
  }
`;
export const CREATE_AGENT_MUTATION = gql`
  mutation createAgent(
    $name: String!
    $npnNumber: String!
    $phoneNumber: String!
    $email: String!
    $licenseNo: String!
    $agentId: String!
    $licenseArea: String!
    $assignedLeads: Int
    $policyStatus: String!
  ) {
    createAgent(
      name: $name
      npnNumber: $npnNumber
      phoneNumber: $phoneNumber
      email: $email
      licenseNo: $licenseNo
      agentId: $agentId
      licenseArea: $licenseArea
      assignedLeads: $assignedLeads
      policyStatus: $policyStatus
    ) {
      id
      name
      npnNumber
      phoneNumber
      email
      agentId
      licenseArea
      assignedLeads
      policyStatus
      licenseNo
    }
  }
`;
export const CREATE_CAMPAIGN_MUTATION = gql`
  mutation CreateCampaign(
    $name: String!
    $targetedAudience: String!
    $leadsCount: Int!
    $endTime: DateTime!
  ) {
    createCampaign(
      name: $name
      targetedAudience: $targetedAudience
      leadsCount: $leadsCount
      endTime: $endTime
    ) {
      id
      name
      targetedAudience
      leadsCount
      endTime
    }
  }
`;
export const CREATE_ADMIN_CAMPAIGN_MUTATION = gql`
  mutation CreateAdminCampaign(
    $name: String!
    $targetedAudience: String!
    $leadsCount: Int!
    $endTime: DateTime!
  ) {
    createCampaign(
      name: $name
      targetedAudience: $targetedAudience
      leadsCount: $leadsCount
      endTime: $endTime
    ) {
      id
      name
      targetedAudience
      leadsCount
      endTime
    }
  }
`;
export const SIGNUP_MUTATION = gql`
  mutation Signup(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $npnNumber: String!
    $licenseNo: String!
    $locationIds: [Int!]!
    $policyIds: [Int!]!
  ) {
    signup(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      npnNumber: $npnNumber
      licenseNo: $licenseNo
      locationIds: $locationIds
      policyIds: $policyIds
    ) {
      token
      agent {
        id
        email
        firstName
        lastName
        locations {
          id
          name
        }
        policies {
          id
          name
        }
      }
    }
  }
`;

export const GET_ALL_LOCATIONS = gql`
  query {
    getAllLocations {
      id
      name
      agents {
        id
        email
      }
    }
  }
`;

export const GET_ALL_POLICIES = gql`
  query {
    getAllPolicies {
      id
      name
      description
      agents {
        id
        email
      }
    }
  }
`;

export const GET_ALL_PLANS = gql`
  query {
    getAllPlans {
      id
      name
      leadCap
      agents {
        id
        email
      }
      agentPlans {
        id
      }
    }
  }
`;
export const UPDATE_AGENT = gql`
  mutation UpdateAgent($id: ID!, $data: UpdateAgentInput!) {
    updateAgent(id: $id, data: $data) {
      id
      firstName
      lastName
      phoneNumber
      email
      npnNumber
      licenseNo
      webhook_url
      globalCap
      monthlyCap
      dailyCap
      remainingCap
      priority
      weight
      toggleStatus

      policies {
        id
        name
      }
      locations {
        id
        name
      }
    }
  }
`;
export const FILTER_AGENTS = gql`
  query FilterAgents($filter: FilterAgentsInput, $page: Int, $perPage: Int) {
    filterAgents(filter: $filter, page: $page, perPage: $perPage) {
      agents {
        id
        email
        firstName
        lastName
        role
        phoneNumber
        npnNumber
        licenseNo
        toggleStatus
        globalCap
        monthlyCap
        dailyCap
        remainingCap
        priority
        weight

        assignedLeads
        createdAt
        campaigns {
          id
          name
        }
        leads {
          id
          name
        }
        policies {
          id
          name
        }
        locations {
          id
          name
        }
      }
      currentPage
      totalPages
      totalAgents
    }
  }
`;

export const FILTER_CAMPAIGNS_QUERY = gql`
  query FilterCampaigns(
    $filter: FilterCampaignsInput
    $page: Int
    $perPage: Int
  ) {
    filterCampaigns(filter: $filter, page: $page, perPage: $perPage) {
      campaigns {
        id
        name
        targetedAudience
        leadsCount
        toggleStatus
        campaign_uuid
        createdAt
        endTime
      }
      currentPage
      totalPages
      totalCampaigns
    }
  }
`;
export const FILTER_LEAD_QUERY = gql`
  query FilterLeads($filter: FilterLeadsInput, $page: Int, $perPage: Int) {
    filterLeads(filter: $filter, page: $page, perPage: $perPage) {
      leads {
        id
        name
        phone
        email
        location
        insuranceType
        startInsurance
        endInsurance
        createdAt
        first_name
        last_name
        tags
        city
        state
        country
        timezone
        postal_code
        full_address
        contact_id
        spouse_gender
        plan_carrier_name
        aor_agent_name
        aor_agent_npn
        ip_address
        spouse_dob
        spouse_ssn
        plan_type
        your_gender
        status
        agentLeads {
          agent {
            id
            firstName
            lastName
            email
            phoneNumber
            assignedLeads
            toggleStatus
          }
        }
      }
      currentPage
      totalPages
      totalLeads
    }
  }
`;

export const GET_AGENTS_QUERY = gql`
  query getAgents($page: Int, $perPage: Int) {
    getAgents(page: $page, perPage: $perPage) {
      agents {
        id
        email
        createdAt
        firstName
        lastName
        role
        phoneNumber
        npnNumber
        licenseNo
        assignedLeads
        toggleStatus
        lastAssignedDate
        globalCap
        monthlyCap
        dailyCap
        remainingCap
        priority
        weight
        remainingWeight
        dailyLeadsCount
        monthlyLeadsCount
        campaigns {
          id
          name
        }
        leads {
          id
          name
          phone
          email
          location
          insuranceType
          startInsurance
          endInsurance
          createdAt
          first_name
          last_name
          tags
          city
          state
          country
          timezone
          postal_code
          full_address
          contact_id
          spouse_gender
          plan_carrier_name
          aor_agent_name
          aor_agent_npn
          ip_address
          spouse_dob
          spouse_ssn
          plan_type
          your_gender
          webhook_data
          lead_response
        }
        policies {
          id
          name
        }
        locations {
          id
          name
        }
      }
      currentPage
      totalPages
      totalAgents
    }
  }
`;
export const GET_Agents_Detail = gql`
  query getAgent($id: ID!) {
    getAgent(id: $id) {
      id
      phoneNumber
      email
      npnNumber
      licenseNo
      assignedLeads
      toggleStatus
      firstName
      lastName
      globalCap
      monthlyCap
      dailyCap
      remainingCap
      priority
      weight
      webhook_url
      campaigns {
        id
        name
      }
      policies {
        id
        name
      }
      locations {
        id
        name
      }

      leads {
        id
        name
        phone
        email
        location
        insuranceType
        startInsurance
        endInsurance
        createdAt
        first_name
        last_name
        tags
        city
        state
        country
        timezone
        postal_code
        full_address
        contact_id
        spouse_gender
        plan_carrier_name
        aor_agent_name
        aor_agent_npn
        ip_address
        spouse_dob
        spouse_ssn
        plan_type
        your_gender
        webhook_data
        lead_response
      }
    }
  }
`;

export const GET_CAMPAIGNS_QUERY = gql`
  query getCampaigns($page: Int, $perPage: Int) {
    getCampaigns(page: $page, perPage: $perPage) {
      campaigns {
        id
        name
        targetedAudience
        leadsCount
        createdAt
        endTime
        toggleStatus
        campaign_uuid
      }
      currentPage
      totalPages
      totalCampaigns
    }
  }
`;

// export const GET_CAMPAIGNS_QUERY = gql`
//   query {
//     getCampaigns {
//       id
//       name
//       targetedAudience
//       createdAt
//       leadsCount
//       endTime
//       toggleStatus
//     }
//   }
// `;
export const CREATE_LEAD_MUTATION = gql`
  mutation CreateLead(
    $name: String!
    $phone: String!
    $email: String!
    $location: String!
    $insuranceType: String!
    $startInsurance: DateTime!
    $endInsurance: DateTime!
  ) {
    createLead(
      name: $name
      phone: $phone
      email: $email
      location: $location
      insuranceType: $insuranceType

      startInsurance: $startInsurance
      endInsurance: $endInsurance
    ) {
      id
      name
      phone
      email
      location
      insuranceType

      startInsurance
      endInsurance
    }
  }
`;
export const GET_LEADS_QUERY = gql`
  query getLeads($page: Int, $perPage: Int) {
    getLeads(page: $page, perPage: $perPage) {
      leads {
        id
        name
        phone
        email
        location
        insuranceType
        startInsurance
        endInsurance
        createdAt
        first_name
        last_name
        tags
        city
        state
        country
        timezone
        postal_code
        full_address
        contact_id
        spouse_gender
        plan_carrier_name
        aor_agent_name
        aor_agent_npn
        ip_address
        spouse_dob
        spouse_ssn
        plan_type
        your_gender
        webhook_data
        lead_response
        status
      }
      currentPage
      totalPages
      totalLeads
    }
  }
`;

// export const GET_LEADS_QUERY = gql`
//   query {
//     getLeads {
//       id
//       name
//       phone
//       email
//       location
//       insuranceType
//       agentId
//       createdAt
//     }
//   }
// `;
export const DELETE_AGENT = gql`
  mutation DeleteAgent($id: ID!) {
    deleteAgent(id: $id) {
      id
      name
    }
  }
`;
export const DELETE_LEAD = gql`
  mutation DeleteLead($id: ID!) {
    deleteLead(id: $id) {
      id
      name
    }
  }
`;
export const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id) {
      id
      name
    }
  }
`;

export const GET_LEAD_DETAIL = gql`
  query GetLead($id: ID!) {
    getLead(id: $id) {
      id
      name
      phone
      email
      location
      agentId
      insuranceType
      postal_code

      assignedTo {
        id
        name
      }
      startInsurance
      endInsurance
    }
  }
`;
export const GET_Campaign_DETAIL = gql`
  query GetCampaign($id: ID!) {
    getCampaign(id: $id) {
      id
      name
      targetedAudience
      leadsCount
      createdAt
      endTime
      toggleStatus
    }
  }
`;

// export const GET_Agents_Detail = gql`
//   query GetAgent($id: ID!) {
//     getAgent(id: $id) {
//       id
//       name
//       phoneNumber
//       email
//       npnNumber
//       agentId
//       licenseNo
//       licenseArea
//       assignedLeads
//       policyStatus
//       toggleStatus

//       leads {
//         id
//         name
//         phone
//         email
//         location
//         agentId
//         insuranceType
//         startInsurance
//         endInsurance
//         postal_code

//         createdAt
//       }
//     }
//   }
// `;

export const UPDATE_AGENT_MUTATION = gql`
  mutation UpdateAgent($id: ID!, $data: UpdateAgentInput!) {
    updateAgent(id: $id, data: $data) {
      id
      name
      phoneNumber
      email
      npnNumber
      agentId
      licenseNo
      licenseArea
      assignedLeads
      policyStatus
      toggleStatus
    }
  }
`;
export const UPDATE_TOGGLE_STATUS_MUTATION = gql`
  mutation UpdateToggleStatus($id: ID!, $data: UpdateAgentInput!) {
    updateAgent(id: $id, data: $data) {
      id
      toggleStatus
    }
  }
`;

export const UPDATE_LEAD_MUTATION = gql`
  mutation UpdateLead($id: ID!, $data: UpdateLeadInput!) {
    updateLead(id: $id, data: $data) {
      id
      name
      phone
      email
      location
      insuranceType
      createdAt
    }
  }
`;

export const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign($id: ID!, $data: UpdateCampaignInput!) {
    updateCampaign(id: $id, data: $data) {
      id
      name
      targetedAudience
      leadsCount
      createdAt
      endTime
      toggleStatus
    }
  }
`;
export const UPDATE_TOGGLE_STATUS_CAMPAIGN_MUTATION = gql`
  mutation UpdateCampaignToggleStatus($id: ID!, $data: UpdateCampaignInput!) {
    updateCampaign(id: $id, data: $data) {
      id
      toggleStatus
    }
  }
`;
export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
    }
  }
`;
