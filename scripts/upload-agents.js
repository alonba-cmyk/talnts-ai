/**
 * Script to upload agent images to Supabase Storage and update agents table
 * Run with: node upload-agents.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://fymyrxqjmnekcmrpvtju.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bXlyeHFqbW5la2NtcnB2dGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDUyMzIsImV4cCI6MjA4NTI4MTIzMn0.B946RoSjn1S2636SbHs6n5J4bIHpAK4-f5qwljytitg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mapping of agent names to their frame numbers
const agentMapping = {
  // Project agents
  'Project Agent': '2147238736',
  'Risk Analyzer': '2147238708',
  'Meeting Scheduler': '2147238718',
  'Follow-up Agent': '2147238710',
  'Action Item Agent': '2147238709',
  
  // Marketing agents
  'Marketing Agent': '2147238730',
  'RSVP Agent': '2147238712',
  'Competitor Agent': '2147238707',
  'Market Landscape Analyzer': '2147238713',
  'Marketing Image Generator': '2147238714',
  'Translator Agent': '2147238727',
  'Translator Agent 2': '2147238747',
  
  // Sales agents
  'Sales Agent': '2147238731',
  'Lead Agent': '2147238715',
  'Contact Duplicates Finder': '2147238716',
  'Sales Agent 2': '2147238746',
  'SDR Agent': '2147238785',
  'Meeting Summarizer': '2147238786',
  
  // Product & Engineering agents
  'Product & Engineering Agent': '2147238732',
  'Sentiment Detector': '2147238719',
  'Bug Prioritization Agent': '2147238720',
  'Release Notes Agent': '2147238721',
  'Competitor Research Agent (Product)': '2147238722',
  'Daily Meeting Briefing Agent': '2147238728',
  
  // Operations agents
  'Operations Agent': '2147238734',
  'Process Automator': '2147238723',
  'Vendor Researcher': '2147238724',
  
  // Support agents
  'Support Agent': '2147238735',
  'Customer Support Agent': '2147238725',
  'SLA Monitor Agent': '2147238726',
  'HR Agent': '2147238751',
  'IT Agent': '2147238749',
  'Financial Agent': '2147238750',
};

// Find image file by frame number
function findImageFile(frameNumber, assetsDir) {
  const files = fs.readdirSync(assetsDir);
  const matchingFile = files.find(f => f.includes(`Frame_${frameNumber}`) || f.includes(`Frame ${frameNumber}`));
  if (matchingFile) {
    return path.join(assetsDir, matchingFile);
  }
  return null;
}

async function uploadImage(filePath, agentName) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `agents/${agentName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    
    const { data, error } = await supabase.storage
      .from('Agents')
      .upload(fileName, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (error) {
      console.error(`Error uploading ${agentName}:`, error.message);
      return null;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage.from('Agents').getPublicUrl(fileName);
    return urlData.publicUrl;
  } catch (err) {
    console.error(`Error processing ${agentName}:`, err.message);
    return null;
  }
}

async function updateAgent(agentName, imageUrl) {
  const { error } = await supabase
    .from('agents')
    .update({ image: imageUrl })
    .eq('name', agentName);
  
  if (error) {
    console.error(`Error updating ${agentName}:`, error.message);
    return false;
  }
  return true;
}

async function main() {
  // Assets directory - update this path if needed
  const assetsDir = path.join(__dirname, '.cursor', 'projects', 'c-Users-AlonBarDavid-Downloads-Work-AI-Platform-Page-Copy', 'assets');
  const altAssetsDir = 'C:\\Users\\AlonBarDavid\\.cursor\\projects\\c-Users-AlonBarDavid-Downloads-Work-AI-Platform-Page-Copy\\assets';
  
  const useDir = fs.existsSync(assetsDir) ? assetsDir : (fs.existsSync(altAssetsDir) ? altAssetsDir : null);
  
  if (!useDir) {
    console.error('Assets directory not found. Please update the path in the script.');
    console.log('Looking for:', assetsDir);
    console.log('Or:', altAssetsDir);
    return;
  }
  
  console.log('Using assets directory:', useDir);
  console.log('Starting upload process...\n');
  
  let uploaded = 0;
  let failed = 0;
  
  for (const [agentName, frameNumber] of Object.entries(agentMapping)) {
    const imagePath = findImageFile(frameNumber, useDir);
    
    if (!imagePath) {
      console.log(`⚠️  No image found for ${agentName} (Frame ${frameNumber})`);
      failed++;
      continue;
    }
    
    console.log(`📤 Uploading ${agentName}...`);
    const imageUrl = await uploadImage(imagePath, agentName);
    
    if (imageUrl) {
      const updated = await updateAgent(agentName, imageUrl);
      if (updated) {
        console.log(`✅ ${agentName} - Done`);
        uploaded++;
      } else {
        console.log(`❌ ${agentName} - Upload OK but DB update failed`);
        failed++;
      }
    } else {
      failed++;
    }
  }
  
  console.log(`\n========================================`);
  console.log(`Upload complete!`);
  console.log(`✅ Uploaded: ${uploaded}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`========================================`);
}

main();
