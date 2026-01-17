const app = require('./index');
const config = require('./config');
const http = require('http');
const gradient = require('gradient-string');
const chalk = require('chalk');

const server = http.createServer(app);

// Fungsi untuk membuat delay (efek loading)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function startServer() {
    console.clear();
    
    // Tampilan Booting ala Hacker
    console.log(chalk.green('INITIALIZING SYSTEM KERNEL...'));
    await sleep(500);
    console.log(chalk.green('LOADING MODULES... [OK]'));
    await sleep(300);
    console.log(chalk.green('BYPASSING FIREWALL... [SUCCESS]'));
    await sleep(800);
    console.clear();

    // ASCII ART SYNTAX AI
    const logo = `
   ██████  ██    ██ ███    ██ ████████  █████  ██   ██ 
  ██       ██    ██ ████   ██    ██    ██   ██  ██ ██  
  ███████   ██  ██  ██ ██  ██    ██    ███████   ███   
       ██    ████   ██  ██ ██    ██    ██   ██  ██ ██  
  ██████      ██    ██   ████    ██    ██   ██ ██   ██ 
                                           
        [ SYSTEM: ONLINE ]   [ MODEL: ${config.ai.model} ]
    `;

    console.log(gradient.retro(logo));
    console.log(chalk.green('=================================================='));
    console.log(chalk.cyan(`  ► SERVER STATUS  : `) + chalk.bold.green(`RUNNING`));
    console.log(chalk.cyan(`  ► PORT           : `) + chalk.yellow(`${config.server.port}`));
    console.log(chalk.cyan(`  ► PANEL NAME     : `) + chalk.magenta(`${config.server.panelName}`));
    console.log(chalk.cyan(`  ► SECURITY       : `) + chalk.red(`ENCRYPTED`));
    console.log(chalk.green('=================================================='));
    console.log(chalk.gray(`\nWaiting for incoming connections on http://localhost:${config.server.port}...`));

    server.listen(config.server.port);
}

startServer();
