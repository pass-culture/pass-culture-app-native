export const getPriceAsNumber = (price?: string, defaultValue?: number) => {
  return price ? +price.replace(',', '.') : defaultValue
}
