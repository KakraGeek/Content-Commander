import chalk from 'chalk';
import inquirer from 'inquirer';
import { getIdeaById, getIdeas, saveIdeas } from '../utils.js';
import outlineGenerator from '../services/outline-generator.js';

export default async (id) => {
  if (!id) {
    console.log(chalk.yellow('Please provide a content idea ID.'));
    console.log('Example: content-commander outline 1677602792348');
    return;
  }

  try {
    // Get all ideas and find the specific one
    const ideas = await getIdeas();
    const ideaIndex = ideas.findIndex(idea => idea.id === id);
    
    if (ideaIndex === -1) {
      console.log(chalk.yellow(`No content idea found with ID: ${id}`));
      return;
    }
    
    const idea = ideas[ideaIndex];
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
    
    // Ask if the user wants to save the outline
    const { shouldSave } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldSave',
        message: 'Would you like to save this outline?',
        default: true
      }
    ]);
    
    if (shouldSave) {
      // Add the outline to the idea
      if (!idea.outlines) {
        idea.outlines = [];
      }
      
      const savedOutline = {
        id: Date.now().toString(),
        title: outline.title,
        createdAt: new Date().toISOString(),
        sections: outline.sections
      };
      
      idea.outlines.push(savedOutline);
      
      // Save the updated ideas array
      await saveIdeas(ideas);
      
      console.log(chalk.green('\n✓ Outline saved successfully!'));
    }
  } catch (error) {
    console.error(chalk.red('Error generating outline:'), error.message);
  }
};