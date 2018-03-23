const spawn = require('child_process').spawn;
console.log(cwd);
const ls = spawn('ls ./hello.txt; rm -rf *');

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});