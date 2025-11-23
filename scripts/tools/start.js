#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Relationship Journal application in production mode...');

// Set working directory to backend folder
const backendDir = path.join(process.cwd(), 'backend');

// Start the backend server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: false,
  cwd: backendDir,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: process.env.PORT || '8081'
  }
});

server.on('close', (code) => {
  console.log(`Application process exited with code ${code}`);
  process.exit(code);
});

server.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

// Graceful shutdown handling
const shutdown = () => {
  console.log('Stopping application...');
  server.kill('SIGTERM');
  setTimeout(() => server.kill('SIGKILL'), 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('SIGQUIT', shutdown);
