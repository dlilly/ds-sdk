import { Activatible } from "./common"

type ReturnMethod = {
    type: string
    code: string
    name: string
    description: string
}

type ConfiguredReturnMethod = Activatible & ReturnMethod & {
    // in the model, displayName is under ReturnMethod
    displayName: string
    instructions: string
}

type ReturnReason = Activatible & {
    name: string
    code: string
}

export { ReturnMethod, ConfiguredReturnMethod, ReturnReason }