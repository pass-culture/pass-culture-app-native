export const getPriceLabel = (minPrice?: number, maxPrice?: number) => {
  let label = 'Prix'

  if (
    (minPrice === 0 && maxPrice === 0) ||
    (minPrice === undefined && maxPrice === 0) ||
    (maxPrice === undefined && minPrice === 0)
  ) {
    label = 'Gratuit'
  } else if (minPrice && minPrice > 0 && maxPrice && maxPrice > 0) {
    label = `${minPrice}€ - ${maxPrice}€`
  } else if (minPrice && minPrice >= 0) {
    label = `>= ${minPrice}€`
  } else if (maxPrice && maxPrice >= 0) {
    label = `<= ${maxPrice}€`
  }

  return label
}
