import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import markdownFormatter from './markdown.js';
import htmlFormatter from './html.js';
import textFormatter from './text.js';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Export directory
const EXPORT_DIR = path.join(process.cwd(), 'exports');

// Available formats
export const formats = {
  markdown: markdownFormatter,
  html: htmlFormatter,
  text: textFormatter
};

// Export a content idea to a file
export async function exportIdea(idea, outline, format = 'markdown') {
  // Ensure export directory exists
  await fs.ensureDir(EXPORT_DIR);
  
  // Get the formatter
  const formatter = formats[format.toLowerCase()];
  if (!formatter) {
    throw new Error(`Unsupported format: ${format}`);
  }
  
  // Format the content
  const content = formatter.format(idea, outline);
  
  // Generate filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${idea.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${timestamp}.${formatter.extension}`;
  const filePath = path.join(EXPORT_DIR, filename);
  
  // Write the file
  await fs.writeFile(filePath, content, 'utf8');
  
  return filePath;
}

export default {
  exportIdea,
  formats
}; 