import fs from 'fs';
import path from 'path';

export interface Package {
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
  author?: string;
}

export default function getPackageJson(absolutePath?: string): Package | null {
  const packageJsonPath = absolutePath || path.resolve(__dirname, '../../../package.json');    
  if (!fs.existsSync(packageJsonPath)) return null;

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      keywords: packageJson.keywords,
      author: packageJson.author
    }
  } catch (_) { console.error("Error reading package.json", _) }

  return null;
}