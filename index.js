import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your command-line program setup here
program
  .version('1.0.0')
  .description('Content Commander - A CLI tool to manage your content ideas')
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

// Define the add command
program
  .command('add')
  .description('Add a new content idea')
  .option('--option <option>', 'An option for the add command (optional)')
  .action(async (options) => {
    if (options.option) {
      console.log('Option provided:', options.option);
    }

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of your content idea?',
        validate: input => input.length > 0
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe your content idea:',
        validate: input => input.length > 0
      },
      {
        type: 'list',
        name: 'type',
        message: 'What type of content is this?',
        choices: ['Blog Post', 'Social Media', 'Newsletter', 'Video', 'Other']
      }
    ]);

    const dataPath = path.join(process.cwd(), 'data', 'ideas.json');
    let ideas = [];

    try {
      await fs.ensureDir(path.dirname(dataPath));
      
      if (await fs.pathExists(dataPath)) {
        try {
          const fileData = await fs.readFile(dataPath, 'utf8');
          // Only try to parse if the file isn't empty
          if (fileData.trim()) {
            ideas = JSON.parse(fileData);
          }
        } catch (error) {
          console.log(chalk.yellow('Warning: Could not read existing data file, creating a new one.'));
          ideas = [];
        }
      }
      
      // Ensure ideas is an array
      if (!Array.isArray(ideas)) {
        ideas = [];
      }
    } catch (error) {
      console.error(chalk.red('Error creating data directory:'), error);
      ideas = [];
    }

    ideas.push({
      id: Date.now().toString(),
      ...answers,
      createdAt: new Date().toISOString()
    });

    try {
      await fs.writeJson(dataPath, ideas, { spaces: 2 });
      console.log(chalk.green('✓ Content idea added successfully!'));
    } catch (error) {
      console.error(chalk.red('Error saving content idea:'), error);
    }
  });

// Parse arguments (only once, after all commands are defined)
program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// Handle global options
const options = program.opts();
if (options.debug) console.log('Debug mode is on');
if (options.small) console.log('- small pizza size');
if (options.pizzaType) console.log(`- ${options.pizzaType} pizza`);