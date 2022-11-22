export const getPriceAsNumber = (price?: string, defaultValue?: number) => {
  return price ? Number(price.replace(',', '.')) : defaultValue
}
