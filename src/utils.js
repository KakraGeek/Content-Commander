import fs from 'fs-extra';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const ideasPath = path.join(dataDir, 'ideas.json');

export async function getIdeas() {
  await fs.ensureDir(dataDir);
  await fs.ensureFile(ideasPath);
  try {
    const data = await fs.readJson(ideasPath);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

export async function saveIdeas(ideas) {
  await fs.ensureDir(dataDir);
  await fs.writeJson(ideasPath, ideas, { spaces: 2 });
}

export async function getIdeaById(id) {
  const ideas = await getIdeas();
  return ideas.find(idea => idea.id === id);
}

export { dataDir, ideasPath }; 

const fs = require('fs-extra');
const path = require('path');
const { handleError } = require('./errorHandler');

const dataDir = path.join(process.cwd(), 'data');
const ideasPath = path.join(dataDir, 'ideas.json');

async function getIdeas() {
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

async function saveIdeas(ideas) {
  try {
    await fs.ensureDir(dataDir);
    await fs.writeJson(ideasPath, ideas, { spaces: 2 });
  } catch (error) {
    handleError(error, 'saving ideas');
    throw error;
  }
}

async function getIdeaById(id) {
  try {
    const ideas = await getIdeas();
    return ideas.find(idea => idea.id === id);
  } catch (error) {
    handleError(error, 'finding idea');
    return null;
  }
}

module.exports = {
  getIdeas,
  saveIdeas,
  getIdeaById,
  dataDir,
  ideasPath
};