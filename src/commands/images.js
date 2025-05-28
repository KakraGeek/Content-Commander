import chalk from 'chalk';
import unsplashService from '../services/unsplash.js';

export default async (keyword) => {
  // Make sure keyword is a string
  if (!keyword || typeof keyword !== 'string') {
    console.log(chalk.yellow('Please provide a search keyword as a string.'));
    console.log('Example: content-commander images "nature"');
    return;
  }

  console.log(chalk.bold(`Searching for images related to "${keyword}"...`));

  try {
    const response = await unsplashService.searchPhotos(keyword);

    if (!response.results || response.results.length === 0) {
      console.log(chalk.yellow(`No images found for "${keyword}".`));
      return;
    }

    console.log(chalk.bold(`Found ${response.results.length} images:\n`));

    response.results.forEach((photo, index) => {
      console.log(chalk.cyan(`${index + 1}. ${photo.description || photo.alt_description || 'Image'}`));
      console.log(`   URL: ${photo.urls.small}`);
      console.log(`   By: ${photo.user.name}`);
      console.log(`   Download: ${photo.links.download}\n`);
    });

    console.log(chalk.dim('Remember to follow Unsplash attribution requirements when using these images.'));
    console.log(chalk.dim('More info: https://help.unsplash.com/en/articles/2511315-guideline-attribution'));
  } catch (error) {
    console.error(chalk.red('Error searching for images:'), error.message);
  }
}; 