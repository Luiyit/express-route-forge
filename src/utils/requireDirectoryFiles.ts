import * as fs from 'fs';
import * as path from 'path';

function requireDirectoryFiles(
  absoluteDirectory: string,
  ignoreFolders: string[] = [],
  exts: string[] = ['.ts', '.js'],
  afterEachLoad?: (module: unknown, path: string) => void,
) {
  // Read the content of the folder
  const files = fs.readdirSync(absoluteDirectory);

  // Loop through all files and subdirectories
  files.forEach((file: string) => {
    const filePath = path.join(absoluteDirectory, file);

    // Check if it's a directory
    if (fs.statSync(filePath).isDirectory()) {
      if (ignoreFolders.includes(file)) return;

      // If it's a directory, recursively call the function to search in that directory
      requireDirectoryFiles(filePath, ignoreFolders, exts, afterEachLoad);
    } else if (exts.includes(path.extname(filePath))) {
      // Require the module
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const currentModule = require(filePath);

      if (typeof afterEachLoad === 'function')
        afterEachLoad(currentModule, filePath);
    }
  });
}

export default requireDirectoryFiles;
