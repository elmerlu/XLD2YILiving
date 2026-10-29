import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Load .env manually
const envPath = path.resolve(process.cwd(), '.env');
let port = 5174;

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    const match = envConfig.match(/PORT=(\d+)/);
    if (match) {
        port = match[1];
    }
}

console.log(`正在啟動開發伺服器 (Port ${port})...`);

const vite = spawn(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', ['vite', '--port', port, '--strictPort'], {
    stdio: 'inherit', // Let Vite output colored logs directly
    shell: true
});

vite.on('close', (code) => {
    if (code !== 0) {
        // Vite handles the error printing usually, but strictPort failures exit with non-zero
        console.log('\n============================================================');
        console.log(`⚠️  錯誤：Port ${port} 似乎被佔用了！`);
        console.log('============================================================');
        console.log(`可能原因：\n1. 上一次的伺服器沒有正常關閉。\n2. 您同時開啟了另一個終端機視窗並執行了伺服器。`);
        console.log('\n💡 解決方法：');
        console.log(`請執行 >> npm run stop << 指令來強制清理佔用，\n然後再次執行 npm run dev 即可。`);
        console.log('============================================================\n');
    }
});
