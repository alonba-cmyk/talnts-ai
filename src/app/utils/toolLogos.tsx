// Mapping of tool names to their logo URLs or components
// Using Google's high-res favicon API for reliable logo fetching

const LOGO = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export const toolLogos: Record<string, string> = {
  // Social Media Management
  'Hootsuite': LOGO('hootsuite.com'),
  'Buffer': LOGO('buffer.com'),
  'Sprout Social': LOGO('sproutsocial.com'),
  
  // Marketing Automation
  'HubSpot Marketing Hub': LOGO('hubspot.com'),
  'Marketo': LOGO('marketo.com'),
  'Pardot': LOGO('salesforce.com'),
  
  // Project Management / Content
  'CoSchedule': LOGO('coschedule.com'),
  'Trello': LOGO('trello.com'),
  'Asana': LOGO('asana.com'),
  
  // CRM
  'Salesforce': LOGO('salesforce.com'),
  'Pipedrive': LOGO('pipedrive.com'),
  'Zoho CRM': LOGO('zoho.com'),
  
  // Customer Support
  'Zendesk': LOGO('zendesk.com'),
  'Intercom': LOGO('intercom.com'),
  'Freshdesk': LOGO('freshworks.com'),
  
  // Analytics
  'Google Analytics': LOGO('google.com'),
  'Mixpanel': LOGO('mixpanel.com'),
  'Amplitude': LOGO('amplitude.com'),
  
  // Communication
  'Slack': LOGO('slack.com'),
  'Microsoft Teams': LOGO('microsoft.com'),
  'Zoom': LOGO('zoom.us'),
};

export function getToolLogo(toolName: string): string | null {
  return toolLogos[toolName] || null;
}
