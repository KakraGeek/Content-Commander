const chalk = require('chalk');
const { getIdeas } = require('../utils');

module.exports = async () => {
  try {
    const ideas = await getIdeas();
    
    if (ideas.length === 0) {
      console.log(chalk.yellow('No content ideas found. Add some with the "add" command!'));
      return;
    }
    
    console.log(chalk.bold(`You have ${ideas.length} content ideas:\\n`));
    
    ideas.forEach((idea) => {
      console.log(chalk.cyan('--------------------------------------'));
      console.log(chalk.bold(`Title: ${idea.title}`));
      console.log(`Description: ${idea.description}`);
      console.log(`Type: ${idea.type}`);
      console.log(`Status: ${idea.status || 'Not set'}`);
      console.log(`Tags: ${(idea.tags && idea.tags.length) ? idea.tags.join(', ') : 'None'}`);
      console.log(`ID: ${idea.id}`);
      console.log(`Created: ${new Date(idea.createdAt).toLocaleString()}`);
      console.log(chalk.cyan('--------------------------------------') + '\\n');
    });
  } catch (error) {
    console.error(chalk.red('Error loading content ideas:'), error.message);
  }
};