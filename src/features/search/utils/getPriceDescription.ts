export const getPriceDescription = (minPrice?: number, maxPrice?: number) => {
  if ((minPrice === 0 && maxPrice === 0) || (minPrice === undefined && maxPrice === 0)) {
    return 'Gratuit'
  }

  if (minPrice && minPrice > 0 && maxPrice && maxPrice > 0) {
    return `de ${minPrice}\u00a0€ à ${maxPrice}\u00a0€`
  }

  if (minPrice && minPrice >= 0) {
    return `${minPrice}\u00a0€ et plus`
  }

  if (maxPrice && maxPrice >= 0) {
    return `${maxPrice}\u00a0€ et moins`
  }

  return ''
}
