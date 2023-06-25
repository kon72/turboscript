import * as fs from 'fs';
import * as path from 'path';
import {HelloWorldBindings} from './hello_world';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const binary = require('@mapbox/node-pre-gyp');
const bindingPath = binary.find(
  path.resolve(path.join(__dirname, '../package.json'))
);

console.log();
console.log('bindingPath:');
console.log(bindingPath);
console.log();

// Check if the node native addon module exists.
if (!fs.existsSync(bindingPath)) {
  throw new Error(
    'The Node.js native addon module (hello_world.node) can not be found at ' +
      `path: ${bindingPath}.\n`
  );
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const bindings: HelloWorldBindings = require(bindingPath);
