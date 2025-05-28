import chalk from 'chalk';
import { getIdeaById } from '../utils.js';

export default async (id, options) => {
  if (!id) {
    console.log(chalk.yellow('Please provide a content idea ID.'));
    console.log('Example: content-commander view-outline 1677602792348');
    return;
  }

  try {
    // Get the content idea
    const idea = await getIdeaById(id);
    
    if (!idea) {
      console.log(chalk.yellow(`No content idea found with ID: ${id}`));
      return;
    }
    
    if (!idea.outlines || idea.outlines.length === 0) {
      console.log(chalk.yellow(`No outlines found for "${idea.title}".`));
      console.log('Generate an outline first with: content-commander outline ' + id);
      return;
    }
    
    // If there are multiple outlines, let the user choose one
    let outlineToView;
    
    if (options?.outlineId) {
      outlineToView = idea.outlines.find(o => o.id === options.outlineId);
      
      if (!outlineToView) {
        console.log(chalk.yellow(`No outline found with ID: ${options.outlineId}`));
        return;
      }
    } else {
      // Default to the most recent outline
      outlineToView = idea.outlines[idea.outlines.length - 1];
    }
    
    // Display the outline
    console.log(chalk.bold(`Outline for "${idea.title}"\n`));
    console.log(chalk.bold('Content Outline:'));
    console.log(chalk.cyan('===============================') + '\n');
    
    console.log(chalk.bold(`Title: ${idea.title}`));
    console.log(`Type: ${idea.type}`);
    console.log(`Tags: ${idea.tags ? idea.tags.join(', ') : 'None'}`);
    console.log(`Created: ${new Date(outlineToView.createdAt).toLocaleString()}\n`);
    
    console.log(chalk.bold('Sections:') + '\n');
    
    outlineToView.sections.forEach((section, index) => {
      console.log(chalk.bold(`${index + 1}. ${section.name}`));
      console.log(`   ${section.content.replace(/\n/g, '\n   ')}\n`);
    });
  } catch (error) {
    console.error(chalk.red('Error viewing outline:'), error.message);
  }
}; 