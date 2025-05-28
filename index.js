#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import searchCommand from './src/commands/search.js';
import filterCommand from './src/commands/filter.js';
import updateCommand from './src/commands/update.js';
import deleteCommand from './src/commands/delete.js';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .version('1.0.0')
  .description('Content Commander - A CLI tool to manage your content ideas')
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

// Add command
program
  .command('add')
  .description('Add a new content idea')
  .action(async () => {
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
          if (fileData.trim()) {
            ideas = JSON.parse(fileData);
          }
        } catch (error) {
          console.log(chalk.yellow('Warning: Could not read existing data file, creating a new one.'));
          ideas = [];
        }
      }
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

// List command
program
  .command('list')
  .description('List all available commands')
  .action(async () => { (await import('./src/commands/list.js')).default(); });

// Insert a new command block for 'calendar' (alias to list) after the list command block.
program
  .command('calendar')
  .description('Alias for "list" – prints a list of content ideas sorted by creation date (calendar view)')
  .action(() => {
    // Invoke the list command (which is already registered) so that "node index.js calendar" behaves like "node index.js list".
    program.parse(['node', 'index.js', 'list']);
  });

// Search command
program
  .command('search')
  .description('Search your content ideas')
  .argument('[query]', 'Search query')
  .action(searchCommand);

// Filter command
program
  .command('filter')
  .description('Filter content ideas by type, status, or tag')
  .option('-t, --type <type>', 'Filter by content type')
  .option('-s, --status <status>', 'Filter by status')
  .option('-g, --tag <tag>', 'Filter by tag')
  .action(filterCommand);

// Update command
program
  .command('update')
  .description('Update an existing content idea (e.g. change status or tags)')
  .argument('<id>', 'ID of the content idea to update')
  .action(updateCommand);

// Delete command
program
  .command('delete <id>')
  .description('Delete a content idea by ID')
  .action(deleteCommand);

  program
  .command('help')
  .description('Display help information')
  .action(async () => { const helpCommand = await import('./src/commands/help.js'); helpCommand.default(); });

  program
  .command('setup')
  .description('Configure Content Commander settings')
  .action(async () => { (await import('./src/commands/setup.js')).default(); });

  program
  .command('images')
  .description('Search for images using Unsplash API')
  .argument('[query]', 'Search query for images')
  .action(async (query) => { (await import('./src/commands/images.js')).default(query); });

  program
  .command('outline <id>')
  .description('Generate an outline for a content idea')
  .action(async (id) => { (await import('./src/commands/outline.js')).default(id); });

// This must be after ALL command definitions:
program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
} 