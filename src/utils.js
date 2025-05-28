import configUtil from './config.js';

import fs from 'fs-extra';
import path from 'path';
import { handleError } from './errorHandler.js';

const dataDir = path.join(process.cwd(), configUtil.get('data.directory', 'data'));
const ideasPath = path.join(dataDir, 'ideas.json');

export async function getIdeas() {
  try {
    await fs.ensureDir(dataDir);
    await fs.ensureFile(ideasPath);
    try {
      const data = await fs.readJson(ideasPath);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (error.name === 'SyntaxError') {
        handleError(error, 'json');
        return [];
      }
      throw error;
    }
  } catch (error) {
    handleError(error, 'reading ideas');
    return [];
  }
}

export async function saveIdeas(ideas) {
  try {
    await fs.ensureDir(dataDir);
    await fs.writeJson(ideasPath, ideas, { spaces: 2 });
  } catch (error) {
    handleError(error, 'saving ideas');
    throw error;
  }
}

export async function getIdeaById(id) {
  try {
    const ideas = await getIdeas();
    return ideas.find(idea => idea.id === id);
  } catch (error) {
    handleError(error, 'finding idea');
    return null;
  }
}

export { dataDir, ideasPath };