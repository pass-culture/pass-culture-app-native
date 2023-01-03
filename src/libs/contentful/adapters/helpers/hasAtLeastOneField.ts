// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasAtLeastOneField = (object: any) => {
  return Object.keys(object).length > 0
}
