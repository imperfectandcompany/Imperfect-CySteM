export interface SubIssueInput {
    label: string;
    type: string;
    placeholder: string;
  }
  
  export const issueCategories: Record<string, string[]> = {
    'Website Issue': ['Cannot log in', 'Unauthorized activity', 'Update personal information', 'Website not loading', 'Error messages'],
    'Gameplay Issue': ['Map Issues', 'Surf Mechanics', 'Player Behavior'],
    'Premium Membership Issue': ['Membership Benefits', 'Billing and Payments'],
    'Other Issues': ['General Inquiry']
  };
  
  export const subIssuesInputs: Record<string, SubIssueInput[]> = {
    'Cannot log in': [
      { label: 'Username or Email', type: 'text', placeholder: 'Enter username or email used' }
    ],
    'Unauthorized activity': [
      { label: 'Description of Activity', type: 'text', placeholder: 'Describe the activity' },
      { label: 'Date of Occurrence', type: 'date', placeholder: 'Select the date of occurrence' }
    ],
    'Update personal information': [
      { label: 'Information to Update', type: 'text', placeholder: 'Specify the information to be updated' }
    ],
    'Website not loading': [
      { label: 'Browser and Version', type: 'text', placeholder: 'Enter browser and version used' }
    ],
    'Error messages': [
      { label: 'Error Messages', type: 'text', placeholder: 'Describe the error messages received' }
    ],
    'Map Issues': [
      { label: 'Map Name', type: 'text', placeholder: 'Enter the map name' },
      { label: 'Description', type: 'textarea', placeholder: 'Describe what was happening' }
    ],
    'Surf Mechanics': [
      { label: 'Surf Mechanic', type: 'text', placeholder: 'Specify the surf mechanic' },
      { label: 'Date of Issue', type: 'date', placeholder: 'Select the date this issue was experienced' }
    ],
    'Player Behavior': [
      { label: 'Username or Steam ID', type: 'text', placeholder: 'Enter username or Steam ID' },
      { label: 'Server', type: 'text', placeholder: 'Enter the server where the issue occurred' },
      { label: 'Description', type: 'textarea', placeholder: 'Describe what occurred' }
    ],
    'Membership Benefits': [
      { label: 'Expected vs. Experienced', type: 'text', placeholder: 'Specify what was expected vs. what was experienced' }
    ],
    'Billing and Payments': [
      { label: 'Transaction ID', type: 'text', placeholder: 'Enter Transaction ID' },
      { label: 'Error Received', type: 'text', placeholder: 'Describe any error received' }
    ],
    'General Inquiry': [
      { label: 'Inquiry Details', type: 'textarea', placeholder: 'Describe your inquiry' }
    ]
  };