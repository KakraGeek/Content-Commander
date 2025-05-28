export const extension = 'html';

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function format(idea, outline) {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(idea.title)}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 { color: #333; }
    h2 { color: #444; border-bottom: 1px solid #eee; padding-bottom: 5px; }
    h3 { color: #555; }
    .metadata { background: #f5f5f5; padding: 15px; border-radius: 5px; }
    .section { margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(idea.title)}</h1>
  
  <div class="metadata">
    <p><strong>Type:</strong> ${escapeHtml(idea.type)}</p>
    <p><strong>Created:</strong> ${new Date(idea.createdAt).toLocaleString()}</p>`;
  
  if (idea.tags && idea.tags.length > 0) {
    html += `
    <p><strong>Tags:</strong> ${escapeHtml(idea.tags.join(', '))}</p>`;
  }
  
  if (idea.status) {
    html += `
    <p><strong>Status:</strong> ${escapeHtml(idea.status)}</p>`;
  }
  
  if (idea.dueDate) {
    html += `
    <p><strong>Due Date:</strong> ${new Date(idea.dueDate).toLocaleDateString()}</p>`;
  }
  
  html += `
  </div>
  
  <h2>Description</h2>
  <p>${escapeHtml(idea.description).replace(/\n/g, '<br>')}</p>`;
  
  if (outline && outline.sections && outline.sections.length > 0) {
    html += `
  <h2>Outline</h2>`;
    
    outline.sections.forEach((section, index) => {
      html += `
  <div class="section">
    <h3>${index + 1}. ${escapeHtml(section.name)}</h3>
    <p>${escapeHtml(section.content).replace(/\n/g, '<br>')}</p>
  </div>`;
    });
  }
  
  html += `
</body>
</html>`;
  
  return html;
}

export default {
  format,
  extension
}; 