import { gql } from "@apollo/client";

export const GET_ALL_CAMPAIGNS_QUERY = gql`
  query getAllCampaigns($page: Int, $perPage: Int) {
    getAllCampaigns(page: $page, perPage: $perPage) {
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


export const GET_ALL_LEAD_QUERY = gql`
  query getAllLeads($page: Int, $perPage: Int) {
    getAllLeads(page: $page, perPage: $perPage) {
      leads  {
       id name phone email location insuranceType startInsurance endInsurance createdAt first_name last_name tags city state country timezone
        postal_code full_address contact_id spouse_gender plan_carrier_name aor_agent_name aor_agent_npn ip_address spouse_dob spouse_ssn plan_type 
        your_gender webhook_data lead_response status agentLeads { agent { id firstName lastName email phoneNumber assignedLeads toggleStatus } } 
      }
      currentPage
      totalPages
      
    }
  }
`;