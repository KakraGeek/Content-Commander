export const extension = 'md';

function format(idea, outline) {
  let markdown = `# ${idea.title}\n\n`;
  
  // Add metadata
  markdown += `**Type:** ${idea.type}\n`;
  markdown += `**Created:** ${new Date(idea.createdAt).toLocaleString()}\n`;
  
  if (idea.tags && idea.tags.length > 0) {
    markdown += `**Tags:** ${idea.tags.join(', ')}\n`;
  }
  
  if (idea.status) {
    markdown += `**Status:** ${idea.status}\n`;
  }
  
  if (idea.dueDate) {
    markdown += `**Due Date:** ${new Date(idea.dueDate).toLocaleDateString()}\n`;
  }
  
  // Add description
  markdown += `\n## Description\n\n${idea.description}\n\n`;
  
  // Add outline
  if (outline && outline.sections && outline.sections.length > 0) {
    markdown += `## Outline\n\n`;
    
    outline.sections.forEach((section, index) => {
      markdown += `### ${index + 1}. ${section.name}\n\n${section.content}\n\n`;
    });
  }
  
  return markdown;
}

export default {
  format,
  extension
}; 