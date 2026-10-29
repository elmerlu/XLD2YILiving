import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Load .env manually to avoid extra dependencies
const envPath = path.resolve(process.cwd(), '.env');
let port = 5174; // default

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    const match = envConfig.match(/PORT=(\d+)/);
    if (match) {
        port = match[1];
    }
}

console.log(`Stopping server on port ${port}...`);
try {
    execSync(`npx kill-port ${port}`, { stdio: 'inherit' });
    console.log('Server stopped successfully.');
} catch (error) {
    console.error('Failed to stop server:', error.message);
}
