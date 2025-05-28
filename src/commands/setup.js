import fs from 'fs-extra';
import path from 'path';
import { parse } from 'dotenv';
import chalk from 'chalk';
import inquirer from 'inquirer';
import configUtil from '../config.js';

/**
 * Update or create an environment variable in the .env file
 * @param {string} key - The environment variable key
 * @param {string} value - The environment variable value
 * @returns {Promise<boolean>} Success status
 */
async function updateEnvFile(key, value) {
  try {
    // Path to .env file
    const envPath = path.resolve(process.cwd(), '.env');
    
    // Create .env file if it doesn't exist
    if (!await fs.pathExists(envPath)) {
      await fs.writeFile(envPath, '', 'utf8');
    }
    
    // Read current .env file
    const envContent = await fs.readFile(envPath, 'utf8');
    const envVars = parse(envContent);
    
    // Update the variable
    envVars[key] = value;
    
    // Convert back to .env format
    const newEnvContent = Object.entries(envVars)
      .map(([key, val]) => `${key}=${val}`)
      .join('\n');
    
    // Write back to file
    await fs.writeFile(envPath, newEnvContent, 'utf8');
    return true;
  } catch (error) {
    console.error(chalk.red('Error updating .env file:'), error.message);
    return false;
  }
}

/**
 * Setup command handler
 */
async function setup() {
  console.log(chalk.blue('\nContent Commander Setup\n'));
  
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'userName',
        message: 'What is your name?',
        default: configUtil.get('user.name', '')
      },
      {
        type: 'password',
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
      },
      {
        type: 'list',
        name: 'aiProvider',
        message: 'Select your preferred AI provider:',
        choices: ['openai', 'anthropic'],
        default: 'openai'
      },
      {
        type: 'password',
        name: 'openaiKey',
        message: 'Enter your OpenAI API key:',
        when: answers => answers.aiProvider === 'openai',
        validate: input => input.length > 0 || 'API key is required'
      },
      {
        type: 'password',
        name: 'anthropicKey',
        message: 'Enter your Anthropic API key:',
        when: answers => answers.aiProvider === 'anthropic',
        validate: input => input.length > 0 || 'API key is required'
      }
    ]);

    // Update configuration
    await configUtil.update('user.name', answers.userName);
    await configUtil.update('apis.unsplash.accessKey', answers.unsplashKey);
    await configUtil.update('export.defaultFormat', answers.exportFormat);
    await configUtil.update('export.outputDir', answers.exportDir);

    // Update environment variables
    const envUpdates = [];
    
    // Update Unsplash key in both config and env
    if (answers.unsplashKey) {
      envUpdates.push(updateEnvFile('UNSPLASH_ACCESS_KEY', answers.unsplashKey));
    }
    
    // Update AI provider keys
    if (answers.aiProvider === 'openai' && answers.openaiKey) {
      envUpdates.push(updateEnvFile('OPENAI_API_KEY', answers.openaiKey));
    }
    
    if (answers.aiProvider === 'anthropic' && answers.anthropicKey) {
      envUpdates.push(updateEnvFile('ANTHROPIC_API_KEY', answers.anthropicKey));
    }
    
    envUpdates.push(updateEnvFile('DEFAULT_AI_PROVIDER', answers.aiProvider));

    // Wait for all environment updates to complete
    const envResults = await Promise.all(envUpdates);
    
    console.log(chalk.green('\n✓ Configuration updated successfully!'));
    console.log(chalk.bold('\nCurrent Configuration:'));
    console.log(chalk.cyan('----------------------------'));
    console.log(`User: ${answers.userName || '(not set)'}`);
    console.log(`Unsplash API Key: ${answers.unsplashKey ? '********' : '(not set)'}`);
    console.log(`Default Export Format: ${answers.exportFormat}`);
    console.log(`Export Directory: ${answers.exportDir}`);
    console.log(`AI Provider: ${answers.aiProvider}`);
    console.log(chalk.cyan('----------------------------'));

    if (!envResults.every(Boolean)) {
      console.warn(chalk.yellow('\nNote: Some environment variables could not be saved.'));
      console.log('The application will still work with the configuration file settings.');
    }
  } catch (error) {
    console.error(chalk.red('Error updating configuration:'), error.message);
  }
}

export default setup; 