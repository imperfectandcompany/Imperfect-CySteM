export interface SubIssueInput {
    label: string;
    type: string;
    placeholder: string;
    tooltip?: string; // Optional tooltip for more detailed information
  }
  
  export interface IssueCategory {
    label: string;
    subCategories?: IssueCategory[];
    subIssues?: SubIssueInput[];
  }

  export const issueCategories: Record<string, string[]> = {
    "Website Issue": [
      "Cannot log in",
      "Unauthorized activity",
      "Update personal information",
      "Website not loading",
      "Error messages",
    ],
    "Gameplay Issue": ["Map Issues", "Surf Mechanics", "Player Behavior"],
    "Premium Membership Issue": ["Membership Benefits", "Billing and Payments"],
    "Other Issues": ["General Inquiry"],
  };
  
  export const subIssuesInputs: Record<string, SubIssueInput[]> = {
    "Cannot log in": [
      {
        label: "Username or Email",
        type: "text",
        placeholder: "Enter username or email used",
        tooltip: "Use the email or username associated with your account.",
      },
    ],
    "Unauthorized activity": [
      {
        label: "Description of Activity",
        type: "text",
        placeholder: "Describe the activity",
        tooltip: "Detail any unauthorized activity on your account.",
      },
      {
        label: "Date of Occurrence",
        type: "date",
        placeholder: "Select the date of occurrence",
        tooltip: "When did you first notice the unauthorized activity?",
      },
    ],
    "Update personal information": [
      {
        label: "Information to Update",
        type: "text",
        placeholder: "Specify the information to be updated",
        tooltip:
          "Specify which part of your personal information needs updating.",
      },
    ],
    "Website not loading": [
      {
        label: "Browser and Version",
        type: "text",
        placeholder: "Enter browser and version used",
        tooltip:
          "Identify the browser and its version where you experienced the issue.",
      },
    ],
    "Error messages": [
      {
        label: "Error Messages",
        type: "text",
        placeholder: "Describe the error messages received",
        tooltip: "Provide the exact error messages you saw, if possible.",
      },
    ],
    "Map Issues": [
      {
        label: "Map Name",
        type: "text",
        placeholder: "Enter the map name",
        tooltip: "Name of the map where the issue occurred.",
      },
      {
        label: "Description",
        type: "textarea",
        placeholder: "Describe what was happening",
        tooltip: "Explain what issue you encountered on the map.",
      },
    ],
    "Surf Mechanics": [
      {
        label: "Surf Mechanic",
        type: "text",
        placeholder: "Specify the surf mechanic",
        tooltip: "Describe the surf mechanic that is not working as expected.",
      },
      {
        label: "Date of Issue",
        type: "date",
        placeholder: "Select the date this issue was experienced",
        tooltip: "When did you encounter the issue with the surf mechanic?",
      },
    ],
    "Player Behavior": [
      {
        label: "Username or Steam ID",
        type: "text",
        placeholder: "Enter username or Steam ID",
        tooltip: "Provide the username or Steam ID of the player in question.",
      },
      {
        label: "Server",
        type: "text",
        placeholder: "Enter the server where the issue occurred",
        tooltip: "Which server were you on when the issue happened?",
      },
      {
        label: "Description",
        type: "textarea",
        placeholder: "Describe what occurred",
        tooltip: "Detail the behavior that was problematic.",
      },
    ],
    "Membership Benefits": [
      {
        label: "Expected vs. Experienced",
        type: "text",
        placeholder: "Specify what was expected vs. what was experienced",
        tooltip:
          "Explain any discrepancies between what was promised and what was received.",
      },
    ],
    "Billing and Payments": [
      {
        label: "Transaction ID",
        type: "text",
        placeholder: "Enter Transaction ID",
        tooltip: "Provide the transaction ID for any payment inquiries.",
      },
      {
        label: "Error Received",
        type: "text",
        placeholder: "Describe any error received",
        tooltip: "If you received an error during payment, describe it here.",
      },
    ],
    "General Inquiry": [
      {
        label: "Inquiry Details",
        type: "textarea",
        placeholder: "Describe your inquiry",
        tooltip: "Provide as much detail as possible about your inquiry.",
      },
    ],
  };