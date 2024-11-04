export const convertEuroToCFP = (priceInEuro: number, euroToCPFRate: number) => {
  return Math.ceil(priceInEuro * euroToCPFRate)
}
