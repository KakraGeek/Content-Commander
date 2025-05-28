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
  .description('List all content ideas')
  .option('-s, --sort <field>', 'Sort by field (title, type, createdAt)', 'createdAt')
  .option('-r, --reverse', 'Reverse the sort order')
  .action(async (options) => {
    const dataPath = path.join(process.cwd(), 'data', 'ideas.json');
    try {
      if (!await fs.pathExists(dataPath)) {
        console.log(chalk.yellow('No content ideas found. Use "add" command to create some!'));
        return;
      }
      const fileData = await fs.readFile(dataPath, 'utf8');
      let ideas = [];
      if (fileData.trim()) {
        ideas = JSON.parse(fileData);
      }
      if (ideas.length === 0) {
        console.log(chalk.yellow('No content ideas found. Use "add" command to create some!'));
        return;
      }
      ideas.sort((a, b) => {
        let comparison = 0;
        if (options.sort === 'createdAt') {
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
        } else {
          comparison = String(a[options.sort]).localeCompare(String(b[options.sort]));
        }
        return options.reverse ? -comparison : comparison;
      });
      console.log(chalk.blue('\nYour Content Ideas:'));
      console.log(chalk.gray('─'.repeat(80)));
      ideas.forEach((idea, index) => {
        console.log(chalk.cyan(`\n${index + 1}. ${idea.title}`));
        console.log(chalk.gray('ID:'), chalk.yellow(idea.id));
        console.log(chalk.gray('Type:'), chalk.yellow(idea.type));
        console.log(chalk.gray('Created:'), chalk.yellow(new Date(idea.createdAt).toLocaleString()));
        console.log(chalk.gray('Description:'), idea.description);
        console.log(chalk.gray('─'.repeat(80)));
      });
      console.log(chalk.green(`\nTotal ideas: ${ideas.length}`));
    } catch (error) {
      console.error(chalk.red('Error reading content ideas:'), error);
    }
  });

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

// This must be after ALL command definitions:
program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
} 