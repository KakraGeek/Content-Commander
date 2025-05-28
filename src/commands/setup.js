import inquirer from 'inquirer';
import chalk from 'chalk';
import configUtil from '../config.js';

export default async () => {
  console.log(chalk.bold('=== Content Commander Setup ===\n'));
  
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'userName',
        message: 'What is your name?',
        default: configUtil.get('user.name', '')
      },
      {
        type: 'input',
        name: 'unsplashKey',
        message: 'Unsplash API key (for image suggestions):',
        default: configUtil.get('apis.unsplash.accessKey', '')
      },
      {
        type: 'list',
        name: 'exportFormat',
        message: 'Default export format:',
        choices: ['markdown', 'html', 'text'],
        default: configUtil.get('export.defaultFormat', 'markdown')
      },
      {
        type: 'input',
        name: 'exportDir',
        message: 'Export directory:',
        default: configUtil.get('export.outputDir', 'exports')
      }
    ]);
    
    // Update configuration
    await configUtil.update('user.name', answers.userName);
    await configUtil.update('apis.unsplash.accessKey', answers.unsplashKey);
    await configUtil.update('export.defaultFormat', answers.exportFormat);
    await configUtil.update('export.outputDir', answers.exportDir);
    
    console.log(chalk.green('\n✓ Configuration updated successfully!'));
    console.log(chalk.bold('\nCurrent Configuration:'));
    console.log(chalk.cyan('----------------------------'));
    console.log(`User: ${answers.userName || '(not set)'}`);
    console.log(`Unsplash API Key: ${answers.unsplashKey ? '********' : '(not set)'}`);
    console.log(`Default Export Format: ${answers.exportFormat}`);
    console.log(`Export Directory: ${answers.exportDir}`);
    console.log(chalk.cyan('----------------------------'));
  } catch (error) {
    console.error(chalk.red('Error updating configuration:'), error.message);
  }
}; 