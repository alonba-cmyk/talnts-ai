/**
 * Script to update all Vibe apps with placeholder images based on their names
 * Run with: node update-vibe-images.cjs
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://fymyrxqjmnekcmrpvtju.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bXlyeHFqbW5la2NtcnB2dGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDUyMzIsImV4cCI6MjA4NTI4MTIzMn0.B946RoSjn1S2636SbHs6n5J4bIHpAK4-f5qwljytitg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Available Vibe images from monday.com/vibe
const vibeImages = {
  // Marketing related
  campaign: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Campaign_health_tracker.svg',
  social: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Social_media_content_calendar.svg',
  customer: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Customer_segmentation_app.svg',
  content: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Social_media_content_calendar.svg',
  
  // Sales related
  deal: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Deal_flow_analyzer.svg',
  sales: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Sales_forecasting_app.svg',
  account: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Account_portfolio_tracker.svg',
  commission: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Sales_commission_calculator.svg',
  forecast: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Sales_forecasting_app.svg',
  
  // Operations related
  supply: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Supply_chain_tracker.svg',
  okr: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/OKR_monitoring_app.svg',
  executive: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Executive_overview_app.svg',
  overview: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Executive_overview_app.svg',
  
  // HR related
  org: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Organizational_chart.svg',
  employee: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Employee_resource_portal.svg',
  resource: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Employee_resource_portal.svg',
  recruit: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Employee_resource_portal.svg',
  onboard: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Employee_resource_portal.svg',
  
  // General/Projects
  event: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Event_portal.svg',
  time: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Time_tracking_app.svg',
  project: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/OKR_monitoring_app.svg',
  
  // Analytics/Dashboard
  analytics: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Campaign_health_tracker.svg',
  dashboard: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Executive_overview_app.svg',
  report: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Executive_overview_app.svg',
  track: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Campaign_health_tracker.svg',
  
  // Brand/Creative
  brand: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Social_media_content_calendar.svg',
  asset: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Social_media_content_calendar.svg',
  creative: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Social_media_content_calendar.svg',
  
  // A/B Test
  test: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Campaign_health_tracker.svg',
  ab: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Campaign_health_tracker.svg',
  
  // Support/Service
  ticket: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Event_portal.svg',
  support: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Event_portal.svg',
  
  // Legal/Finance
  contract: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Executive_overview_app.svg',
  invoice: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Sales_commission_calculator.svg',
  budget: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Sales_commission_calculator.svg',
  
  // Default fallback images (rotate through)
  default: [
    'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Campaign_health_tracker.svg',
    'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Social_media_content_calendar.svg',
    'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Customer_segmentation_app.svg',
    'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Deal_flow_analyzer.svg',
    'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Executive_overview_app.svg',
  ]
};

// Get an appropriate image based on app name
function getImageForApp(name, index) {
  const nameLower = name.toLowerCase();
  
  // Check for keyword matches
  for (const [keyword, imageUrl] of Object.entries(vibeImages)) {
    if (keyword !== 'default' && nameLower.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Fallback to rotating default images
  return vibeImages.default[index % vibeImages.default.length];
}

async function updateVibeImages() {
  console.log('Fetching all Vibe apps...');
  
  // Fetch all Vibe apps
  const { data: apps, error: fetchError } = await supabase
    .from('vibe_apps')
    .select('*')
    .order('name');
  
  if (fetchError) {
    console.error('Error fetching apps:', fetchError);
    return;
  }
  
  console.log(`Found ${apps.length} Vibe apps`);
  
  // Update each app with an appropriate image
  let updated = 0;
  let skipped = 0;
  
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    
    // Skip if already has a non-empty image
    if (app.image && app.image.trim() !== '') {
      console.log(`Skipping "${app.name}" - already has image`);
      skipped++;
      continue;
    }
    
    const newImage = getImageForApp(app.name, i);
    
    console.log(`Updating "${app.name}" with image...`);
    
    const { error: updateError } = await supabase
      .from('vibe_apps')
      .update({ image: newImage })
      .eq('id', app.id);
    
    if (updateError) {
      console.error(`Error updating "${app.name}":`, updateError);
    } else {
      updated++;
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Total apps: ${apps.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (already have images): ${skipped}`);
  console.log('Done!');
}

// Run the update
updateVibeImages().catch(console.error);
