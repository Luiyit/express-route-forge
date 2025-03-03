import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

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
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      json(),
    ],
    external:['express', 'firebase-admin', 'joi'],
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
    plugins: [
      resolve(),
      commonjs(), 
      typescript(),
      json(), 
    ],
    external:['express', 'firebase-admin', 'joi'],
  }
];
