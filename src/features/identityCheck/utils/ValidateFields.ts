const ZIP_CODE_PATTERN = /^[0-9 ]{5}$/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const composeValidators = (...validators: Array<any>) => (value: any) =>
  validators.reduce((error, validator) => error || validator(value), undefined)

// return true if error
const required = (value: unknown) => value === null
const zipCodeFormat = (value: string) => !ZIP_CODE_PATTERN.test(value)

export { composeValidators, required, zipCodeFormat }
