import yargs from 'yargs'

import YargsCommandBuilderOptions from './helpers/yargs-builder'
import { middleware } from './helpers/ds-middleware'

// TODO: add ds-tenant-id and ds-api-key options

yargs
    .usage(`usage: $0 <command>`)
    .scriptName(`ds`)
    .middleware(middleware)
    .commandDir(`./commands`, { 
      ...YargsCommandBuilderOptions
    })
    .argv