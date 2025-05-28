export const extension = 'txt';

function format(idea, outline) {
  let text = `${idea.title.toUpperCase()}\n\n`;
  
  // Add metadata
  text += `Type: ${idea.type}\n`;
  text += `Created: ${new Date(idea.createdAt).toLocaleString()}\n`;
  
  if (idea.tags && idea.tags.length > 0) {
    text += `Tags: ${idea.tags.join(', ')}\n`;
  }
  
  if (idea.status) {
    text += `Status: ${idea.status}\n`;
  }
  
  if (idea.dueDate) {
    text += `Due Date: ${new Date(idea.dueDate).toLocaleDateString()}\n`;
  }
  
  // Add description
  text += `\nDESCRIPTION\n==========\n\n${idea.description}\n\n`;
  
  // Add outline
  if (outline && outline.sections && outline.sections.length > 0) {
    text += `OUTLINE\n=======\n\n`;
    
    outline.sections.forEach((section, index) => {
      text += `${index + 1}. ${section.name}\n${'='.repeat(section.name.length + 3)}\n\n${section.content}\n\n`;
    });
  }
  
  return text;
}

export default {
  format,
  extension
}; 