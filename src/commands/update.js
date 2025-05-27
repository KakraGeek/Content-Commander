import inquirer from 'inquirer';
import chalk from 'chalk';
import { getIdeas, saveIdeas } from '../utils.js';

export default async function (id) {
  if (!id) {
    console.log(chalk.yellow('Please provide an idea ID to update.'));
    return;
  }
  const ideas = await getIdeas();
  const ideaIndex = ideas.findIndex(idea => idea.id === id);
  if (ideaIndex === -1) {
    console.log(chalk.yellow(`No content idea found with ID: ${id}`));
    return;
  }
  const idea = ideas[ideaIndex];
  const answers = await inquirer.prompt([
    { type: 'input', name: 'title', message: 'Title:', default: idea.title },
    { type: 'input', name: 'description', message: 'Description:', default: idea.description }
  ]);
  ideas[ideaIndex] = { ...idea, ...answers };
  await saveIdeas(ideas);
  console.log(chalk.green('✓ Content idea updated successfully!'));
} 