import prompts from './src/services/prompts.js';

// Sample content idea data
const idea = {
  title: 'The Ultimate Guide to Content Management',
  description: 'A comprehensive guide to managing content efficiently across different platforms',
  type: 'Blog Post',
  tags: ['content management', 'productivity', 'workflow'],
  audience: 'Content creators and marketing professionals',
  tone: 'Informative and practical'
};

// Test outline prompt
const outlinePrompt = prompts.preparePrompt('outline', idea.type, idea);
console.log('\n\nOUTLINE PROMPT:\n');
console.log(outlinePrompt);

// Test draft prompt (with simple outline)
const outline = '1. Introduction\n2. Content Management Basics\n3. Building an Efficient Workflow\n4. Tools for Success\n5. Conclusion';
const draftPrompt = prompts.preparePrompt('draft', idea.type, {...idea, outline});
console.log('\n\nDRAFT PROMPT:\n');
console.log(draftPrompt);

// Test custom prompt
const customPrompt = prompts.preparePrompt('custom', 'SEO Keywords', idea);
console.log('\n\nCUSTOM PROMPT (SEO Keywords):\n');
console.log(customPrompt);

// List available prompt types and templates
console.log('\n\nAVAILABLE PROMPT TYPES:');
const types = prompts.getPromptTypes();
types.forEach(type => {
  console.log(`\n${type}:`);
  const templates = prompts.getTemplatesForType(type);
  templates.forEach(template => console.log(`  - ${template}`));
}); 