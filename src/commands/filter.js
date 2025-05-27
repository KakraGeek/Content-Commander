import chalk from 'chalk';
import { getIdeas } from '../utils.js';

export default async (options) => {
  try {
    const ideas = await getIdeas();
    if (ideas.length === 0) {
      console.log(chalk.yellow('No content ideas found. Add some with the "add" command!'));
      return;
    }
    // Apply filters
    let results = [...ideas];
    if (options.type) {
      results = results.filter(idea =>
        idea.type && idea.type.toLowerCase() === options.type.toLowerCase());
    }
    if (options.status) {
      results = results.filter(idea =>
        idea.status && idea.status.toLowerCase() === options.status.toLowerCase());
    }
    if (options.tag) {
      const searchTag = options.tag.toLowerCase();
      results = results.filter(idea =>
        idea.tags && Array.isArray(idea.tags) &&
        idea.tags.some(tag => tag.toLowerCase() === searchTag));
    }
    if (results.length === 0) {
      console.log(chalk.yellow('No content ideas match the specified filters.'));
      return;
    }
    console.log(chalk.bold(`Found ${results.length} content ideas matching your filters:\n`));
    results.forEach((idea) => {
      console.log(chalk.cyan('--------------------------------------'));
      console.log(chalk.bold(`Title: ${idea.title}`));
      console.log(`Description: ${idea.description}`);
      console.log(`Type: ${idea.type}`);
      console.log(`Status: ${idea.status || 'Not set'}`);
      console.log(`Tags: ${(idea.tags && idea.tags.length) ? idea.tags.join(', ') : 'None'}`);
      console.log(`ID: ${idea.id}`);
      console.log(`Created: ${new Date(idea.createdAt).toLocaleString()}`);
      console.log(chalk.cyan('--------------------------------------') + '\n');
    });
  } catch (error) {
    console.error(chalk.red('Error filtering content ideas:'), error.message);
  }
}; 