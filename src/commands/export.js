import chalk from 'chalk';
import { getIdeaById } from '../utils.js';
import exportService from '../exports/index.js';
import configUtil from '../config.js';

export default async (id, options) => {
  if (!id) {
    console.log(chalk.yellow('Please provide a content idea ID.'));
    console.log('Example: content-commander export 1677602792348 --format markdown');
    return;
  }

  try {
    // Get the content idea
    const idea = await getIdeaById(id);
    
    if (!idea) {
      console.log(chalk.yellow(`No content idea found with ID: ${id}`));
      return;
    }
    
    // Get format
    const format = (options.format || configUtil.get('export.defaultFormat', 'markdown')).toLowerCase();
    
    if (!exportService.formats[format]) {
      console.log(chalk.yellow(`Unsupported format: ${format}`));
      console.log(`Supported formats: ${Object.keys(exportService.formats).join(', ')}`);
      return;
    }
    
    console.log(chalk.bold(`Exporting "${idea.title}" as ${format}...`));
    
    // Get outline
    let outline = null;
    if (idea.outlines && idea.outlines.length > 0) {
      if (options.outlineId) {
        outline = idea.outlines.find(o => o.id === options.outlineId);
      } else {
        // Use the most recent outline
        outline = idea.outlines[idea.outlines.length - 1];
      }
    }
    
    // Export the idea
    const filePath = await exportService.exportIdea(idea, outline, format);
    
    console.log(chalk.green('\n✓ Content exported successfully!'));
    console.log(`File: ${filePath}`);
  } catch (error) {
    console.error(chalk.red('Error exporting content:'), error.message);
  }
}; 