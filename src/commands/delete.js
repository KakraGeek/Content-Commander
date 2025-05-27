import inquirer from 'inquirer';
import chalk from 'chalk';
import { getIdeas, saveIdeas } from '../utils.js';

export default async (id) => {
  if (!id) {
    console.log(chalk.yellow('Please provide an idea ID to delete.'));
    console.log('Example: content-commander delete 1677602792348');
    return;
  }

  try {
    const ideas = await getIdeas();
    const ideaIndex = ideas.findIndex(idea => idea.id === id);
    
    if (ideaIndex === -1) {
      console.log(chalk.yellow(`No content idea found with ID: ${id}`));
      return;
    }
    
    const idea = ideas[ideaIndex];
    
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete "${idea.title}"?`,
        default: false
      }
    ]);
    
    if (!confirm) {
      console.log(chalk.yellow('Delete cancelled.'));
      return;
    }
    
    // Remove the idea from the array
    ideas.splice(ideaIndex, 1);
    
    await saveIdeas(ideas);
    console.log(chalk.green('✓ Content idea deleted successfully!'));
  } catch (error) {
    console.error(chalk.red('Error deleting content idea:'), error.message);
  }
}; 