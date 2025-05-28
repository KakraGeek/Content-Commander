import configUtil from '../config.js';

// Prompt templates for different content types and uses
const templates = {
  outline: {
    'Blog Post': `Create a detailed content outline for the following blog post:

Title: {{title}}
Description: {{description}}
Tags: {{tags}}

The outline should include:
1. A compelling introduction section that hooks the reader
2. Main sections with clear headings (at least 3-5 main sections)
3. Subsections where appropriate
4. Key points to cover in each section
5. A strong conclusion section

Audience: {{audience}}
Tone: {{tone}}

Make sure the outline follows blogging best practices and is structured to keep the reader engaged throughout the post.`,
    
    'Newsletter': `Create a detailed outline for the following newsletter:

Title: {{title}}
Description: {{description}}
Tags: {{tags}}

The outline should include:
1. A compelling subject line and preview text
2. An engaging opening that hooks subscribers immediately
3. Main content sections with clear value propositions
4. Visual element suggestions
5. A clear call-to-action
6. Footer elements

Audience: {{audience}}
Tone: {{tone}}

Make sure the outline follows email marketing best practices and is designed to achieve high open and click-through rates.`,
    
    'Social Media': `Create a detailed content plan for a social media post series about:

Title: {{title}}
Description: {{description}}
Tags: {{tags}}

The plan should include:
1. Core message and value proposition
2. Content structure for 3-5 related posts
3. Key points to cover in each post
4. Suggested hashtags
5. Call-to-action ideas
6. Visual content suggestions

Audience: {{audience}}
Tone: {{tone}}

Make sure the plan follows social media best practices for engagement and is designed to maximize reach and interaction.`,
    
    'Video': `Create a detailed script outline for the following video:

Title: {{title}}
Description: {{description}}
Tags: {{tags}}

The outline should include:
1. Hook/intro (first 10-15 seconds)
2. Main sections with timestamps
3. Key talking points for each section
4. Visual/b-roll suggestions
5. Call-to-action

Audience: {{audience}}
Tone: {{tone}}

Make sure the outline follows video content best practices and is structured to maintain viewer engagement throughout.`,
    
    'Other': `Create a detailed content outline for the following:

Title: {{title}}
Description: {{description}}
Tags: {{tags}}

The outline should include:
1. Introduction
2. Main sections (at least 3-5)
3. Key points for each section
4. Conclusion

Audience: {{audience}}
Tone: {{tone}}

Make sure the outline is well-structured and comprehensive.`
  },
  
  draft: {
    'Blog Post': `Write a complete blog post draft based on the following information and outline:

Title: {{title}}
Description: {{description}}
Tags: {{tags}}

Outline:
{{outline}}

Audience: {{audience}}
Tone: {{tone}}

Create a well-structured, engaging blog post that follows this outline. Include a compelling introduction, well-developed main points, and a strong conclusion with a call-to-action. The writing should be polished and ready for minimal editing.`,
    
    'Newsletter': `Write a complete newsletter draft based on the following information and outline:

Title: {{title}}
Description: {{description}}
Tags: {{tags}}

Outline:
{{outline}}

Audience: {{audience}}
Tone: {{tone}}

Create a well-structured, engaging newsletter that follows this outline. Include a compelling subject line, engaging intro, valuable main content, and a clear call-to-action. The writing should be formatted appropriately for email and designed to achieve high engagement.`,

    'Social Media': `Write a series of social media posts based on the following information and outline:

Topic: {{title}}
Description: {{description}}
Tags: {{tags}}

Outline:
{{outline}}

Audience: {{audience}}
Tone: {{tone}}

Create 3-5 engaging social media posts that follow this outline. Each post should be appropriately formatted for social platforms, include relevant hashtags, and contain a clear call-to-action. The writing should be attention-grabbing and designed to maximize engagement.`,

    'Video': `Write a complete video script based on the following information and outline:

Title: {{title}}
Description: {{description}}
Tags: {{tags}}

Outline:
{{outline}}

Audience: {{audience}}
Tone: {{tone}}

Create a well-structured, engaging video script that follows this outline. Include an attention-grabbing hook, clear transitions between sections, and a strong call-to-action. Format the script with clear indications of what should be said (dialogue) and any production notes.`,

    'Other': `Write a complete draft based on the following information and outline:

Title: {{title}}
Description: {{description}}
Tags: {{tags}}

Outline:
{{outline}}

Audience: {{audience}}
Tone: {{tone}}

Create a well-structured, engaging piece that follows this outline. Include a compelling introduction, well-developed main points, and a strong conclusion. The writing should be polished and ready for minimal editing.`
  },
  
  custom: {
    'Headline Ideas': `Generate 10 compelling headline ideas for the following content:

Title/Topic: {{title}}
Description: {{description}}
Content Type: {{type}}

Audience: {{audience}}
Tone: {{tone}}

Create headline ideas that are attention-grabbing, clear, and designed to maximize engagement. Include a mix of approaches (question headlines, how-to headlines, list headlines, etc.).`,
    
    'SEO Keywords': `Generate a comprehensive list of SEO keywords and phrases for the following content:

Title/Topic: {{title}}
Description: {{description}}
Content Type: {{type}}

Include:
1. Primary keyword suggestions (5-7)
2. Secondary keyword suggestions (10-15)
3. Long-tail keyword phrases (10-15)
4. Questions people might ask related to this topic (5-7)

Make sure the keywords are relevant to the topic, have search volume potential, and include a mix of difficulty levels.`,
    
    'Call to Action': `Generate 5-7 effective call-to-action (CTA) options for the following content:

Title/Topic: {{title}}
Description: {{description}}
Content Type: {{type}}
Goal: {{goal}}

Audience: {{audience}}
Tone: {{tone}}

Create CTAs that are clear, compelling, and aligned with the stated goal. Each CTA should motivate the audience to take the desired action while matching the overall tone of the content.`,
    
    'Social Media Promotion': `Generate a set of social media posts to promote the following content:

Title: {{title}}
Description: {{description}}
Content Type: {{type}}
URL: {{url}}

Audience: {{audience}}
Tone: {{tone}}

Create 3 posts each for:
1. Twitter/X (within character limits)
2. LinkedIn (professional tone)
3. Facebook (conversational tone)
4. Instagram (visual focus with caption)

Each post should include a compelling hook, key value proposition, and clear call-to-action. Include relevant hashtag suggestions for each platform.`
  }
};

// Get available prompt types
export function getPromptTypes() {
  return Object.keys(templates);
}

// Get available templates for a type
export function getTemplatesForType(type) {
  return templates[type] ? Object.keys(templates[type]) : [];
}

// Get a specific template
export function getTemplate(type, template) {
  if (!templates[type]) return null;
  return templates[type][template] || null;
}

// Prepare a template with data
export function preparePrompt(type, templateName, data) {
  const template = getTemplate(type, templateName);
  if (!template) return null;
  
  // Fill in the template with data
  let prompt = template;
  
  // Replace placeholders
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    
    // Handle arrays (like tags)
    let replacementValue = value;
    if (Array.isArray(value)) {
      replacementValue = value.join(', ');
    }
    
    // Replace all instances
    prompt = prompt.replace(new RegExp(placeholder, 'g'), replacementValue || '');
  }
  
  // Fill in defaults for missing data
  prompt = prompt.replace(/{{audience}}/g, 'General audience interested in this topic');
  prompt = prompt.replace(/{{tone}}/g, 'Professional but conversational');
  prompt = prompt.replace(/{{goal}}/g, 'Engage the audience and provide value');
  prompt = prompt.replace(/{{url}}/g, 'URL will be added when content is published');
  
  // Replace any remaining placeholders
  prompt = prompt.replace(/{{\w+}}/g, '');
  
  return prompt;
}

export default {
  getPromptTypes,
  getTemplatesForType,
  getTemplate,
  preparePrompt
}; 