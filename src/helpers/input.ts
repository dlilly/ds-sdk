const validateIsPositive = (input: string) => !isNaN(parseFloat(input)) && parseFloat(input) > 0
export { validateIsPositive }