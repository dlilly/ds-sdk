const { AutoComplete, Confirm, Input } = require('enquirer')

const validateIsPositive = (input: string) => {
    const num = parseFloat(input)
    if (isNaN(parseFloat(input))) {
        return `invalid value ${input}`
    }
    else if (num <= 0) {
        return `invalid value, must be positive`
    }
    return true
}

const inputPositiveFloat = (message: string) => (new Input({ message, validate: validateIsPositive, result: parseFloat })).run()

export { inputPositiveFloat }