import configUtil from '../config.js';

// Template library for different content types
const templates = {
  'Blog Post': {
    sections: [
      'Introduction',
      'The Problem',
      'The Solution',
      'Key Points',
      'Examples',
      'Conclusion'
    ],
    details: {
      'Introduction': 'Introduction to "{{title}}"',
      'The Problem': 'Describe the problem or challenge',
      'The Solution': 'Present your solution or approach',
      'Key Points': '• Key point 1\n• Key point 2\n• Key point 3',
      'Examples': 'Provide real-world examples',
      'Conclusion': 'Summarize and provide next steps'
    }
  },
  'Newsletter': {
    sections: [
      'Opening Hook',
      'Main Story',
      'Secondary Content',
      'Resources/Links',
      'Call to Action'
    ],
    details: {
      'Opening Hook': 'Engaging opener for "{{title}}"',
      'Main Story': 'Primary content focus',
      'Secondary Content': 'Additional valuable information',
      'Resources/Links': '• Resource 1\n• Resource 2\n• Resource 3',
      'Call to Action': 'What should readers do next?'
    }
  },
  'Social Media': {
    sections: [
      'Hook',
      'Value Statement',
      'Supporting Points',
      'Call to Action'
    ],
    details: {
      'Hook': 'Attention-grabbing opening line',
      'Value Statement': 'What value is being offered',
      'Supporting Points': '• Point 1\n• Point 2\n• Point 3',
      'Call to Action': 'Clear next step for the audience'
    }
  },
  'Video': {
    sections: [
      'Intro Hook',
      'Introduction',
      'Main Content Points',
      'Demonstration',
      'Summary',
      'Call to Action'
    ],
    details: {
      'Intro Hook': 'First 5-10 seconds to grab attention',
      'Introduction': 'Explain what the video will cover',
      'Main Content Points': '• Point 1\n• Point 2\n• Point 3',
      'Demonstration': 'Show how it works or what it looks like',
      'Summary': 'Recap key takeaways',
      'Call to Action': 'What viewers should do next'
    }
  },
  'Other': {
    sections: [
      'Introduction',
      'Main Points',
      'Supporting Details',
      'Conclusion'
    ],
    details: {
      'Introduction': 'Introduction to "{{title}}"',
      'Main Points': '• Point 1\n• Point 2\n• Point 3',
      'Supporting Details': 'Additional information and context',
      'Conclusion': 'Summary and next steps'
    }
  }
};

// Replace placeholders in template
function replacePlaceholders(text, data) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
  });
}

// Generate outline from template
function generateOutline(contentIdea) {
  const contentType = contentIdea.type || 'Other';
  const template = templates[contentType] || templates['Other'];
  
  const outline = {
    title: contentIdea.title,
    type: contentType,
    tags: contentIdea.tags || [],
    sections: []
  };
  
  // Generate sections based on template
  outline.sections = template.sections.map(sectionName => {
    const details = template.details[sectionName] || '';
    
    return {
      name: sectionName,
      content: replacePlaceholders(details, contentIdea)
    };
  });
  
  return outline;
}

export default {
  generateOutline
}; 