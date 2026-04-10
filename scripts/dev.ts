import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

console.log('🚀 Starting UCT Clone development server...\n');

// Start backend server
const backend = spawn('tsx', ['watch', 'server/index.ts'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
});

// Wait a bit for backend to start, then start frontend
setTimeout(() => {
  console.log('\n📱 Starting frontend development server...\n');
  
  const frontend = spawn('vite', ['--host'], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping development servers...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });

  backend.on('error', (err) => {
    console.error('Backend error:', err);
    process.exit(1);
  });

  frontend.on('error', (err) => {
    console.error('Frontend error:', err);
    process.exit(1);
  });
}, 2000);

process.on('exit', () => {
  backend.kill();
});
