const { exec, spawn } = require('child_process');
const path = require('path');
const path = require('path');
// This serves everything in the 'uploads' folder via the /api/pdf route
app.use('/api/pdf', express.static(path.join(__dirname, 'uploads')));
// Kill any process using port 8081
exec('netstat -ano | findstr :8081', (error, stdout, stderr) => {
  if (stdout) {
    const lines = stdout.trim().split('\n');
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5) {
        const pid = parts[parts.length - 1];
        console.log(`Killing process ${pid} using port 8081...`);
        exec(`taskkill /PID ${pid} /F`, (killError) => {
          if (killError) {
            console.log(`Failed to kill process ${pid}:`, killError.message);
          } else {
            console.log(`Successfully killed process ${pid}`);
          }
        });
      }
    });
  }
  
  // Wait a moment then start the server
  setTimeout(() => {
    console.log('Starting server...');
    const server = spawn('node', ['index.js'], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    server.on('error', (err) => {
      console.error('Failed to start server:', err);
    });
    
    server.on('close', (code) => {
      console.log(`Server exited with code ${code}`);
    });
  }, 2000);
});
