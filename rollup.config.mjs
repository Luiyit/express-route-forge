import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import path from 'path';

const external = ['express', 'firebase-admin', 'joi'];

function createPlugins(declarationDir) {
  return [
    resolve(),
    commonjs(),
    typescript({
      declaration: true,
      declarationDir: declarationDir,
      rootDir: 'src',
    }),
    json(),
  ];
}

function createBuildConfig(input, outputPath) {
  // Extract directory from output path (e.g., 'utils/validateJoiSchema' -> 'utils')
  const outputDir = path.dirname(outputPath);
  const declarationDir = outputDir === '.' ? 'dist' : `dist/${outputDir}`;
  
  return {
    input,
    output: [
      {
        file: `dist/${outputPath}.cjs`,
        format: 'cjs',
        sourcemap: false,
        exports: 'auto',
      },
      {
        file: `dist/${outputPath}.esm.js`,
        format: 'esm',
        sourcemap: false,
        exports: 'auto',
      },
    ],
    plugins: createPlugins(declarationDir),
    external,
  };
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: false,
        exports: 'auto',
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: false,
        exports: 'auto',
      },
    ],
    plugins: createPlugins('dist'),
    external,
  },
  {
    input: 'src/jest.ts',
    output: [
      {
        file: 'dist/jest.cjs',
        format: 'cjs',
        exports: 'auto',
      },
      {
        file: 'dist/jest.esm.js',
        format: 'esm',
        exports: 'auto',
      }
    ],
    plugins: createPlugins('dist'),
    external,
  },
  // Individual utility exports
  createBuildConfig('src/utils/validateJoiSchema/index.ts', 'utils/validateJoiSchema'),
  createBuildConfig('src/utils/requireDirectoryFiles/index.ts', 'utils/requireDirectoryFiles'),
  createBuildConfig('src/utils/packageJson/index.ts', 'utils/packageJson'),
  createBuildConfig('src/utils/firebase/admin/index.ts', 'utils/firebase/admin'),
  createBuildConfig('src/utils/jest/index.ts', 'utils/jest'),
];
