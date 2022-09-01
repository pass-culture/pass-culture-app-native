import { getPriceLabel } from 'features/search/utils/getPriceLabel'

describe('getPriceLabel', () => {
  it('should return "Gratuit" when minimum price is 0 and maximum price undefined', () => {
    const label = getPriceLabel(0)
    expect(label).toStrictEqual('Gratuit')
  })

  it('should return "Gratuit" when minimum price undefined and maximum price is 0', () => {
    const label = getPriceLabel(undefined, 0)
    expect(label).toStrictEqual('Gratuit')
  })

  it('should return "Gratuit" when minimum price is 0 and maximum price is 0', () => {
    const label = getPriceLabel(0, 0)
    expect(label).toStrictEqual('Gratuit')
  })

  it('should return "5€ - 20€" when minimum price is 5 and maximum price is 20', () => {
    const label = getPriceLabel(5, 20)
    expect(label).toStrictEqual('5€ - 20€')
  })

  it('should return ">= 5€" when minimum price is 5 and maximum price is undefined', () => {
    const label = getPriceLabel(5)
    expect(label).toStrictEqual('>= 5€')
  })

  it('should return "<= 5€" when minimum price is undefined and maximum price is 5', () => {
    const label = getPriceLabel(undefined, 5)
    expect(label).toStrictEqual('<= 5€')
  })
})
