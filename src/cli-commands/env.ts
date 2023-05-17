import { input } from '@inquirer/prompts'
import { DeliverySolutionsClient } from '../ds-client'

const promptQuestionnaire = async() => {
    return {
        name: await input({ message: 'name' }),
        tenantId: await input({ message: 'tenantId' }),
        apiKey: await input({ message: 'apiKey' })
    }
}

const commands = [
    {
        command: 'show',
        describe: 'show current environment',
        handler: function (context: { ds: DeliverySolutionsClient }) {
        },
    },
    {
        command: 'add',
        describe: 'add and use a new environment',
        handler: function () {
            // promptQuestionnaire().then(answers => {
            //     // do a call to the platform to validate credentials
            //     const ds = new DeliverySolutionsClient(answers.tenantId, answers.apiKey)
            //     ds.getBrands().then(console.log)
            // })    
        },
    }
]