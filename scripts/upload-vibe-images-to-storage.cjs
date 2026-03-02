/**
 * Script to download Vibe images from Cloudinary and upload them to Supabase Storage
 * Then update the database with the new URLs
 * Run with: node upload-vibe-images-to-storage.cjs
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

// Supabase configuration
const SUPABASE_URL = 'https://fymyrxqjmnekcmrpvtju.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bXlyeHFqbW5la2NtcnB2dGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDUyMzIsImV4cCI6MjA4NTI4MTIzMn0.B946RoSjn1S2636SbHs6n5J4bIHpAK4-f5qwljytitg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Vibe images to upload
const vibeImagesToUpload = [
  { name: 'campaign_health_tracker', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Campaign_health_tracker.svg' },
  { name: 'social_media_content_calendar', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Social_media_content_calendar.svg' },
  { name: 'customer_segmentation_app', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Customer_segmentation_app.svg' },
  { name: 'deal_flow_analyzer', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Deal_flow_analyzer.svg' },
  { name: 'sales_forecasting_app', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Sales_forecasting_app.svg' },
  { name: 'account_portfolio_tracker', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Account_portfolio_tracker.svg' },
  { name: 'sales_commission_calculator', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Sales_commission_calculator.svg' },
  { name: 'supply_chain_tracker', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Supply_chain_tracker.svg' },
  { name: 'okr_monitoring_app', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/OKR_monitoring_app.svg' },
  { name: 'executive_overview_app', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Executive_overview_app.svg' },
  { name: 'organizational_chart', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Organizational_chart.svg' },
  { name: 'employee_resource_portal', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Employee_resource_portal.svg' },
  { name: 'event_portal', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Event_portal.svg' },
  { name: 'time_tracking_app', url: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Time_tracking_app.svg' },
];

// Download file from URL and return as buffer
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const options = {
      rejectUnauthorized: false // For SSL issues
    };
    
    protocol.get(url, options, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// Get content type from URL
function getContentType(url) {
  if (url.includes('.svg')) return 'image/svg+xml';
  if (url.includes('.png')) return 'image/png';
  if (url.includes('.jpg') || url.includes('.jpeg')) return 'image/jpeg';
  if (url.includes('.gif')) return 'image/gif';
  if (url.includes('.webp')) return 'image/webp';
  return 'image/svg+xml'; // Default for Vibe images
}

async function uploadVibeImages() {
  console.log('Starting upload of Vibe images to Supabase Storage...\n');
  
  const uploadedImages = {};
  let successCount = 0;
  let errorCount = 0;
  
  for (const image of vibeImagesToUpload) {
    console.log(`Downloading ${image.name}...`);
    
    try {
      // Download the image
      const fileBuffer = await downloadFile(image.url);
      console.log(`  Downloaded ${fileBuffer.length} bytes`);
      
      // Upload to Supabase Storage (Vibe bucket)
      const fileName = `${image.name}.svg`;
      const contentType = getContentType(image.url);
      
      console.log(`  Uploading to Vibe/${fileName}...`);
      
      const { data, error } = await supabase.storage
        .from('Vibe')
        .upload(fileName, fileBuffer, {
          contentType: contentType,
          upsert: true // Overwrite if exists
        });
      
      if (error) {
        console.log(`  Error: ${error.message}`);
        errorCount++;
        continue;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('Vibe')
        .getPublicUrl(fileName);
      
      console.log(`  Uploaded successfully!`);
      console.log(`  Public URL: ${urlData.publicUrl}`);
      
      uploadedImages[image.name] = urlData.publicUrl;
      successCount++;
      
    } catch (err) {
      console.log(`  Error downloading: ${err.message}`);
      errorCount++;
    }
    
    console.log('');
  }
  
  console.log('\n=== Upload Summary ===');
  console.log(`Successfully uploaded: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  
  if (successCount > 0) {
    console.log('\n=== Uploaded Image URLs ===');
    for (const [name, url] of Object.entries(uploadedImages)) {
      console.log(`${name}: ${url}`);
    }
    
    // Now update the Vibe apps in the database with the new URLs
    console.log('\n=== Updating Database ===');
    await updateVibeAppsWithNewUrls(uploadedImages);
  }
  
  console.log('\nDone!');
}

// Map app names to image names
function getImageNameForApp(appName) {
  const nameLower = appName.toLowerCase();
  
  if (nameLower.includes('campaign') || nameLower.includes('a/b') || nameLower.includes('test') || nameLower.includes('analytics')) {
    return 'campaign_health_tracker';
  }
  if (nameLower.includes('social') || nameLower.includes('content') || nameLower.includes('brand') || nameLower.includes('asset') || nameLower.includes('landing')) {
    return 'social_media_content_calendar';
  }
  if (nameLower.includes('customer') || nameLower.includes('lead') || nameLower.includes('segment')) {
    return 'customer_segmentation_app';
  }
  if (nameLower.includes('deal')) {
    return 'deal_flow_analyzer';
  }
  if (nameLower.includes('sales') || nameLower.includes('forecast')) {
    return 'sales_forecasting_app';
  }
  if (nameLower.includes('account')) {
    return 'account_portfolio_tracker';
  }
  if (nameLower.includes('commission') || nameLower.includes('invoice') || nameLower.includes('budget')) {
    return 'sales_commission_calculator';
  }
  if (nameLower.includes('supply')) {
    return 'supply_chain_tracker';
  }
  if (nameLower.includes('okr') || nameLower.includes('sprint') || nameLower.includes('project')) {
    return 'okr_monitoring_app';
  }
  if (nameLower.includes('executive') || nameLower.includes('dashboard') || nameLower.includes('overview') || nameLower.includes('report') || nameLower.includes('e-sign') || nameLower.includes('workflow')) {
    return 'executive_overview_app';
  }
  if (nameLower.includes('org')) {
    return 'organizational_chart';
  }
  if (nameLower.includes('employee') || nameLower.includes('recruit') || nameLower.includes('onboard') || nameLower.includes('resource')) {
    return 'employee_resource_portal';
  }
  if (nameLower.includes('event') || nameLower.includes('ticket') || nameLower.includes('support')) {
    return 'event_portal';
  }
  if (nameLower.includes('time')) {
    return 'time_tracking_app';
  }
  
  return 'campaign_health_tracker'; // Default
}

async function updateVibeAppsWithNewUrls(uploadedImages) {
  // Fetch all Vibe apps
  const { data: apps, error: fetchError } = await supabase
    .from('vibe_apps')
    .select('*');
  
  if (fetchError) {
    console.log('Error fetching apps:', fetchError.message);
    return;
  }
  
  console.log(`Found ${apps.length} apps to update`);
  
  let updated = 0;
  for (const app of apps) {
    const imageName = getImageNameForApp(app.name);
    const newUrl = uploadedImages[imageName];
    
    if (!newUrl) {
      console.log(`No uploaded image for "${app.name}" (mapped to ${imageName})`);
      continue;
    }
    
    const { error: updateError } = await supabase
      .from('vibe_apps')
      .update({ image: newUrl })
      .eq('id', app.id);
    
    if (updateError) {
      console.log(`Error updating "${app.name}": ${updateError.message}`);
    } else {
      console.log(`Updated "${app.name}" -> ${imageName}`);
      updated++;
    }
  }
  
  console.log(`\nUpdated ${updated} apps with new Storage URLs`);
}

// Run
uploadVibeImages().catch(console.error);
