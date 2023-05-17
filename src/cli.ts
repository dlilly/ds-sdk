import yargs from 'yargs';

import YargsCommandBuilderOptions from './yargs-builder';
import { middleware } from './builder';

yargs
    .usage('usage: $0 <command>')
    .scriptName('ds')
    .middleware(middleware)
    .commandDir('./commands', { 
      ...YargsCommandBuilderOptions
    })
    .argv