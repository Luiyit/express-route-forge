import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

const plugins = [
  resolve(),
  commonjs(),
  typescript(),
  json(),
];

const external = ['express', 'firebase-admin', 'joi'];

function createBuildConfig(input, outputPath) {
  return {
    input,
    output: [
      {
        file: `dist/${outputPath}.cjs`,
        format: 'cjs',
        sourcemap: false,
      },
      {
        file: `dist/${outputPath}.esm.js`,
        format: 'esm',
        sourcemap: false,
      },
    ],
    plugins,
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
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: false,
      },
    ],
    plugins,
    external,
  },
  {
    input: 'src/jest.ts',
    output: [
      {
        file: 'dist/jest.cjs',
        format: 'cjs'
      },
      {
        file: 'dist/jest.esm.js',
        format: 'esm'
      }
    ],
    plugins,
    external,
  },
  // Individual utility exports
  createBuildConfig('src/utils/validateJoiSchema/index.ts', 'utils/validateJoiSchema'),
  createBuildConfig('src/utils/requireDirectoryFiles/index.ts', 'utils/requireDirectoryFiles'),
  createBuildConfig('src/utils/packageJson/index.ts', 'utils/packageJson'),
  createBuildConfig('src/utils/firebase/admin/index.ts', 'utils/firebase/admin'),
  createBuildConfig('src/utils/jest/index.ts', 'utils/jest'),
];
