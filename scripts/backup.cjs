/**
 * Backup/Restore System for Codebase
 * 
 * Commands:
 *   node backup.cjs save [name]     - Create a backup with optional name
 *   node backup.cjs list            - List all available backups
 *   node backup.cjs restore [id]    - Restore from a specific backup (use ID from list)
 *   node backup.cjs delete [id]     - Delete a specific backup
 * 
 * Examples:
 *   node backup.cjs save before-changes
 *   node backup.cjs list
 *   node backup.cjs restore 1
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BACKUP_DIR = '.backups';
const INCLUDE = ['src', 'public', 'package.json', 'vite.config.ts', 'tsconfig.json', 'tsconfig.node.json', 'index.html'];
const EXCLUDE = ['node_modules', '.backups', 'dist', 'build', '.git', '.cursor'];

// Get the project root directory (parent of scripts/)
const PROJECT_ROOT = path.join(__dirname, '..');
const BACKUP_PATH = path.join(PROJECT_ROOT, BACKUP_DIR);

// Helper: Format date for backup folder name
function formatDate(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

// Helper: Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  
  fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    // Skip excluded directories
    if (EXCLUDE.includes(entry.name)) continue;
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper: Copy file
function copyFile(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.copyFileSync(src, dest);
}

// Helper: Delete directory recursively
function deleteDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      deleteDir(fullPath);
    } else {
      fs.unlinkSync(fullPath);
    }
  }
  
  fs.rmdirSync(dirPath);
}

// Helper: Get all backups sorted by date (newest first)
function getBackups() {
  if (!fs.existsSync(BACKUP_PATH)) {
    return [];
  }
  
  const entries = fs.readdirSync(BACKUP_PATH, { withFileTypes: true });
  const backups = entries
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const stats = fs.statSync(path.join(BACKUP_PATH, entry.name));
      return {
        name: entry.name,
        path: path.join(BACKUP_PATH, entry.name),
        created: stats.mtime
      };
    })
    .sort((a, b) => b.created - a.created);
  
  return backups;
}

// Command: Save backup
function saveBackup(name) {
  console.log('\n========================================');
  console.log('  Creating Backup');
  console.log('========================================\n');
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(BACKUP_PATH)) {
    fs.mkdirSync(BACKUP_PATH, { recursive: true });
  }
  
  // Create backup folder name
  const timestamp = formatDate(new Date());
  const folderName = name ? `${timestamp}_${name}` : timestamp;
  const backupFolder = path.join(BACKUP_PATH, folderName);
  
  console.log(`Backup folder: ${folderName}\n`);
  
  // Create the backup folder
  fs.mkdirSync(backupFolder, { recursive: true });
  
  let fileCount = 0;
  
  // Copy included items
  for (const item of INCLUDE) {
    const srcPath = path.join(PROJECT_ROOT, item);
    const destPath = path.join(backupFolder, item);
    
    if (!fs.existsSync(srcPath)) {
      console.log(`  Skipping ${item} (not found)`);
      continue;
    }
    
    const stats = fs.statSync(srcPath);
    
    if (stats.isDirectory()) {
      console.log(`  Copying ${item}/...`);
      copyDir(srcPath, destPath);
      // Count files in directory
      const countFiles = (dir) => {
        let count = 0;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            count += countFiles(path.join(dir, entry.name));
          } else {
            count++;
          }
        }
        return count;
      };
      fileCount += countFiles(destPath);
    } else {
      console.log(`  Copying ${item}`);
      copyFile(srcPath, destPath);
      fileCount++;
    }
  }
  
  console.log('\n========================================');
  console.log(`  Backup Complete!`);
  console.log('========================================');
  console.log(`  Files backed up: ${fileCount}`);
  console.log(`  Location: ${BACKUP_DIR}/${folderName}`);
  console.log('========================================\n');
}

// Command: List backups
function listBackups() {
  console.log('\n========================================');
  console.log('  Available Backups');
  console.log('========================================\n');
  
  const backups = getBackups();
  
  if (backups.length === 0) {
    console.log('  No backups found.');
    console.log('  Create one with: node backup.cjs save [name]\n');
    return;
  }
  
  backups.forEach((backup, index) => {
    const date = backup.created.toLocaleString();
    console.log(`  [${index + 1}] ${backup.name}`);
    console.log(`      Created: ${date}\n`);
  });
  
  console.log('========================================');
  console.log('  To restore: node backup.cjs restore [id]');
  console.log('  To delete:  node backup.cjs delete [id]');
  console.log('========================================\n');
}

// Command: Restore backup
function restoreBackup(id) {
  console.log('\n========================================');
  console.log('  Restoring Backup');
  console.log('========================================\n');
  
  const backups = getBackups();
  
  if (backups.length === 0) {
    console.log('  No backups available to restore.\n');
    return;
  }
  
  const index = parseInt(id) - 1;
  
  if (isNaN(index) || index < 0 || index >= backups.length) {
    console.log(`  Invalid backup ID: ${id}`);
    console.log(`  Use 'node backup.cjs list' to see available backups.\n`);
    return;
  }
  
  const backup = backups[index];
  console.log(`  Restoring from: ${backup.name}\n`);
  
  // First, create a safety backup of current state
  console.log('  Creating safety backup of current state...');
  const safetyName = `safety_before_restore_${formatDate(new Date())}`;
  const safetyFolder = path.join(BACKUP_PATH, safetyName);
  fs.mkdirSync(safetyFolder, { recursive: true });
  
  for (const item of INCLUDE) {
    const srcPath = path.join(PROJECT_ROOT, item);
    const destPath = path.join(safetyFolder, item);
    
    if (!fs.existsSync(srcPath)) continue;
    
    const stats = fs.statSync(srcPath);
    if (stats.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
  console.log(`  Safety backup created: ${safetyName}\n`);
  
  // Now restore from the selected backup
  console.log('  Restoring files...');
  
  for (const item of INCLUDE) {
    const srcPath = path.join(backup.path, item);
    const destPath = path.join(PROJECT_ROOT, item);
    
    if (!fs.existsSync(srcPath)) {
      console.log(`    Skipping ${item} (not in backup)`);
      continue;
    }
    
    const stats = fs.statSync(srcPath);
    
    if (stats.isDirectory()) {
      // Delete existing directory first
      if (fs.existsSync(destPath)) {
        deleteDir(destPath);
      }
      console.log(`    Restoring ${item}/...`);
      copyDir(srcPath, destPath);
    } else {
      console.log(`    Restoring ${item}`);
      copyFile(srcPath, destPath);
    }
  }
  
  console.log('\n========================================');
  console.log('  Restore Complete!');
  console.log('========================================');
  console.log(`  Restored from: ${backup.name}`);
  console.log(`  Safety backup: ${safetyName}`);
  console.log('========================================\n');
}

// Command: Delete backup
function deleteBackup(id) {
  console.log('\n========================================');
  console.log('  Deleting Backup');
  console.log('========================================\n');
  
  const backups = getBackups();
  
  if (backups.length === 0) {
    console.log('  No backups available to delete.\n');
    return;
  }
  
  const index = parseInt(id) - 1;
  
  if (isNaN(index) || index < 0 || index >= backups.length) {
    console.log(`  Invalid backup ID: ${id}`);
    console.log(`  Use 'node backup.cjs list' to see available backups.\n`);
    return;
  }
  
  const backup = backups[index];
  console.log(`  Deleting: ${backup.name}`);
  
  deleteDir(backup.path);
  
  console.log('\n========================================');
  console.log('  Backup Deleted!');
  console.log('========================================\n');
}

// Show help
function showHelp() {
  console.log(`
========================================
  Backup/Restore System
========================================

Commands:
  save [name]     Create a backup (optional name)
  list            List all available backups
  restore [id]    Restore from a backup
  delete [id]     Delete a backup

Examples:
  node backup.cjs save before-changes
  node backup.cjs list
  node backup.cjs restore 1
  node backup.cjs delete 2

========================================
`);
}

// Main
const args = process.argv.slice(2);
const command = args[0];
const param = args[1];

switch (command) {
  case 'save':
    saveBackup(param);
    break;
  case 'list':
    listBackups();
    break;
  case 'restore':
    if (!param) {
      console.log('\nError: Please provide a backup ID.');
      console.log('Use: node backup.cjs restore [id]\n');
    } else {
      restoreBackup(param);
    }
    break;
  case 'delete':
    if (!param) {
      console.log('\nError: Please provide a backup ID.');
      console.log('Use: node backup.cjs delete [id]\n');
    } else {
      deleteBackup(param);
    }
    break;
  default:
    showHelp();
}
