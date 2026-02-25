/**
 * Script to update agent images in the database with Supabase Storage URLs
 * 
 * This script:
 * 1. Lists all files in the 'Agents' Supabase Storage bucket
 * 2. Lists all agents from the database
 * 3. Optionally uploads missing images from local assets folder
 * 4. Updates agents with matching image URLs based on the mapping
 * 
 * Run with: node update-agent-images.cjs
 * 
 * Options:
 *   --upload    Also upload local images to storage if not present
 *   --force     Update all agents, even those with existing images
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://fymyrxqjmnekcmrpvtju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bXlyeHFqbW5la2NtcnB2dGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDUyMzIsImV4cCI6MjA4NTI4MTIzMn0.B946RoSjn1S2636SbHs6n5J4bIHpAK4-f5qwljytitg';

const supabase = createClient(supabaseUrl, supabaseKey);

// Base URL for Supabase Storage public files
const STORAGE_BASE_URL = 'https://fymyrxqjmnekcmrpvtju.supabase.co/storage/v1/object/public/Agents/';

// Mapping of agent names to their image file names in the Agents bucket
// Using Frame-based filenames that match what's in Supabase Storage
const agentImageMapping = {
  // ============================================
  // PROJECT AGENTS
  // ============================================
  'Project Agent': 'Frame 2147238736.png',
  'Risk Analyzer': 'Frame 2147238708.png',
  'Meeting Scheduler': 'Frame 2147238718.png',
  'Follow-up Agent': 'Frame 2147238710.png',
  'Action Item Agent': 'Frame 2147238709.png',
  
  // ============================================
  // MARKETING AGENTS
  // ============================================
  'Marketing Agent': 'Frame 2147238730.png',
  'RSVP Agent': 'Frame 2147238712.png',
  'Competitor Agent': 'Frame 2147238707.png',
  'Market Landscape Analyzer': 'Frame 2147238713.png',
  'Marketing Image Generator': 'Frame 2147238714.png',
  'Translator Agent': 'Frame 2147238727.png',
  'Translator Agent 2': 'Frame 2147238747.png',
  
  // ============================================
  // SALES AGENTS
  // ============================================
  'Sales Agent': 'Frame 2147238731.png',
  'Lead Agent': 'Frame 2147238715.png',
  'Contact Duplicates Finder': 'Frame 2147238716.png',
  'Sales Agent 2': 'Frame 2147238746.png',
  'SDR Agent': 'Frame 2147238785.png',
  'Meeting Summarizer': 'Frame 2147238786.png',
  
  // ============================================
  // PRODUCT & ENGINEERING AGENTS
  // ============================================
  'Product & Engineering Agent': 'Frame 2147238732.png',
  'Sentiment Detector': 'Frame 2147238719.png',
  'Bug Prioritization Agent': 'Frame 2147238720.png',
  'Release Notes Agent': 'Frame 2147238721.png',
  'Competitor Research Agent (Product)': 'Frame 2147238722.png',
  'Daily Meeting Briefing Agent': 'Frame 2147238728.png',
  
  // ============================================
  // OPERATIONS AGENTS
  // ============================================
  'Operations Agent': 'Frame 2147238734.png',
  'Process Automator': 'Frame 2147238723.png',
  'Vendor Researcher': 'Frame 2147238724.png',
  
  // ============================================
  // SUPPORT AGENTS
  // ============================================
  'Support Agent': 'Frame 2147238735.png',
  'Customer Support Agent': 'Frame 2147238725.png',
  'SLA Monitor Agent': 'Frame 2147238726.png',
  
  // ============================================
  // OTHER DEPARTMENT AGENTS
  // ============================================
  'HR Agent': 'Frame 2147238751.png',
  'IT Agent': 'Frame 2147238749.png',
  'Financial Agent': 'Frame 2147238750.png',
  
  // ============================================
  // GENERIC DEFAULT IMAGE (fallback for any unmapped agents)
  // ============================================
  '_default': 'Frame 2147238707.png'
};

// Parse command line arguments
const args = process.argv.slice(2);
const shouldUpload = args.includes('--upload');
const forceUpdate = args.includes('--force');

// Local assets directory
const ASSETS_DIR = path.join(__dirname, 'src', 'assets');

async function listStorageFiles() {
  console.log('\n📂 Listing files in Agents bucket...\n');
  
  const { data: files, error } = await supabase.storage
    .from('Agents')
    .list('', { limit: 500 });
  
  if (error) {
    console.error('Error listing files:', error.message);
    return [];
  }
  
  if (!files || files.length === 0) {
    console.log('No files found in Agents bucket.');
    return [];
  }
  
  console.log(`Found ${files.length} files in bucket.`);
  
  return files;
}

async function uploadImageToStorage(fileName) {
  const localPath = path.join(ASSETS_DIR, fileName);
  
  if (!fs.existsSync(localPath)) {
    console.log(`    ⚠️  Local file not found: ${fileName}`);
    return false;
  }
  
  try {
    const fileBuffer = fs.readFileSync(localPath);
    
    const { data, error } = await supabase.storage
      .from('Agents')
      .upload(fileName, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (error) {
      console.log(`    ❌ Upload failed: ${error.message}`);
      return false;
    }
    
    console.log(`    ✅ Uploaded ${fileName} to storage`);
    return true;
  } catch (err) {
    console.log(`    ❌ Error uploading: ${err.message}`);
    return false;
  }
}

async function listAgents() {
  console.log('\n📋 Listing agents from database...\n');
  
  const { data: agents, error } = await supabase
    .from('agents')
    .select('id, name, image, department_id')
    .order('name');
  
  if (error) {
    console.error('Error listing agents:', error.message);
    return [];
  }
  
  if (!agents || agents.length === 0) {
    console.log('No agents found in database.');
    return [];
  }
  
  console.log(`Found ${agents.length} agents:`);
  agents.forEach(agent => {
    const imageStatus = agent.image ? '✅ Has image' : '❌ No image';
    console.log(`  - ${agent.name} (${imageStatus})`);
  });
  
  return agents;
}

async function updateAgentImage(agentId, agentName, imageUrl) {
  const { error } = await supabase
    .from('agents')
    .update({ image: imageUrl })
    .eq('id', agentId);
  
  if (error) {
    console.error(`  ❌ Error updating ${agentName}:`, error.message);
    return false;
  }
  
  console.log(`  ✅ Updated ${agentName}`);
  return true;
}

async function updateAgentsWithImages(agents, storageFiles) {
  console.log('\n🔄 Updating agent images...\n');
  
  if (forceUpdate) {
    console.log('  ⚡ Force mode: updating ALL agents\n');
  }
  
  if (shouldUpload) {
    console.log('  📤 Upload mode: will upload missing images from local assets\n');
  }
  
  // Create a set of available file names for quick lookup
  let availableFiles = new Set(storageFiles.map(f => f.name));
  
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  let uploaded = 0;
  
  for (const agent of agents) {
    console.log(`\n  Processing: ${agent.name}`);
    
    // Check if agent already has an image (skip unless force mode)
    if (agent.image && !forceUpdate) {
      console.log(`    ⏭️  Skipping - already has image`);
      skipped++;
      continue;
    }
    
    // Look for a mapping for this agent
    let imageFile = agentImageMapping[agent.name];
    
    // If no specific mapping, try the default
    if (!imageFile) {
      imageFile = agentImageMapping['_default'];
      console.log(`    ℹ️  No specific mapping, using default image`);
    } else {
      console.log(`    📎 Found mapping: ${imageFile}`);
    }
    
    // Check if the file exists in storage
    if (!availableFiles.has(imageFile)) {
      console.log(`    ⚠️  Image not in storage bucket`);
      
      // If upload mode is enabled, try to upload from local assets
      if (shouldUpload) {
        const uploadSuccess = await uploadImageToStorage(imageFile);
        if (uploadSuccess) {
          availableFiles.add(imageFile);
          uploaded++;
        } else {
          failed++;
          continue;
        }
      } else {
        console.log(`    💡 Run with --upload to upload from local assets`);
        failed++;
        continue;
      }
    }
    
    // Construct the full URL
    const imageUrl = STORAGE_BASE_URL + imageFile;
    
    // Update the agent
    const success = await updateAgentImage(agent.id, agent.name, imageUrl);
    if (success) {
      updated++;
    } else {
      failed++;
    }
  }
  
  return { updated, skipped, failed, uploaded };
}

async function main() {
  console.log('========================================');
  console.log('  Agent Image Update Script');
  console.log('========================================');
  console.log('');
  console.log('Options:');
  console.log(`  --upload: ${shouldUpload ? 'ENABLED' : 'disabled'}`);
  console.log(`  --force:  ${forceUpdate ? 'ENABLED' : 'disabled'}`);
  console.log('');
  
  // Check if local assets directory exists
  if (shouldUpload) {
    if (fs.existsSync(ASSETS_DIR)) {
      const assetFiles = fs.readdirSync(ASSETS_DIR).filter(f => f.endsWith('.png'));
      console.log(`📁 Local assets directory: ${ASSETS_DIR}`);
      console.log(`   Found ${assetFiles.length} PNG files\n`);
    } else {
      console.log(`⚠️  Local assets directory not found: ${ASSETS_DIR}\n`);
    }
  }
  
  // Step 1: List files in storage
  const storageFiles = await listStorageFiles();
  
  // Step 2: List agents from database
  const agents = await listAgents();
  
  if (agents.length === 0) {
    console.log('\n⚠️  No agents to update. Run migrate-data.cjs first.');
    return;
  }
  
  if (storageFiles.length === 0 && !shouldUpload) {
    console.log('\n⚠️  No images in storage. You can:');
    console.log('  1. Run with --upload to upload from local assets');
    console.log('  2. Supabase Dashboard → Storage → Agents → Upload');
    console.log('  3. Admin Panel image uploader');
    return;
  }
  
  // Step 3: Update agents with images
  const results = await updateAgentsWithImages(agents, storageFiles);
  
  console.log('\n========================================');
  console.log('  Update Complete!');
  console.log('========================================');
  console.log(`  ✅ Updated:  ${results.updated}`);
  console.log(`  ⏭️  Skipped:  ${results.skipped}`);
  console.log(`  📤 Uploaded: ${results.uploaded || 0}`);
  console.log(`  ❌ Failed:   ${results.failed}`);
  console.log('========================================\n');
  
  if (results.failed > 0) {
    console.log('💡 Tips for fixing failed updates:');
    console.log('   1. Ensure images are uploaded to Supabase Storage "Agents" bucket');
    console.log('   2. Run with --upload flag to auto-upload from local assets');
    console.log('   3. Check the agentImageMapping in this script for correct filenames\n');
  }
  
  if (results.skipped > 0 && !forceUpdate) {
    console.log('ℹ️  Some agents were skipped because they already have images.');
    console.log('   Run with --force to update all agents regardless.\n');
  }
}

main().catch(console.error);
