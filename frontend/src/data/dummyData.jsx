export const dummyAgents = Array.from({ length: 20 }, (_, index) => ({
    id: `agent-${index + 1}`,
    name: `Agent ${index + 1}`,
    phoneNumber: `+1 (555) 555-${(1000 + index).toString().slice(1)}`,
    email: `agent${index + 1}@example.com`,
    npnNumber: `NPN${10000 + index}`,
    agentId: `AID${1000 + index}`,
    licenseNo: `LIC${5000 + index}`,
    licenseArea: `Area-${(index % 5) + 1}`,
    assignedLeads: Math.floor(Math.random() * 100),
    policyStatus: ['Active', 'Inactive'][index % 2],
    toggleStatus: Math.random() > 0.5,  
  }));
  