import chalk from 'chalk';
import { getIdeaById } from '../utils.js';
import outlineGenerator from '../services/outline-generator.js';

export default async (id) => {
  if (!id) {
    console.log(chalk.yellow('Please provide a content idea ID.'));
    console.log('Example: content-commander outline 1677602792348');
    return;
  }

  try {
    // Get the content idea
    const idea = await getIdeaById(id);
    
    if (!idea) {
      console.log(chalk.yellow(`No content idea found with ID: ${id}`));
      return;
    }
    
    console.log(chalk.bold(`Generating outline for "${idea.title}"\n`));
    
    // Generate outline
    const outline = outlineGenerator.generateOutline(idea);
    
    // Display outline
    console.log(chalk.bold('Content Outline:'));
    console.log(chalk.cyan('===============================') + '\n');
    
    console.log(chalk.bold(`Title: ${outline.title}`));
    console.log(`Type: ${outline.type}`);
    console.log(`Tags: ${outline.tags.join(', ') || 'None'}\n`);
    
    console.log(chalk.bold('Sections:\n'));
    
    outline.sections.forEach((section, index) => {
      console.log(chalk.bold(`${index + 1}. ${section.name}`));
      console.log(`   ${section.content.replace(/\n/g, '\n   ')}\n`);
    });
    
  } catch (error) {
    console.error(chalk.red('Error generating outline:'), error.message);
  }
}; 