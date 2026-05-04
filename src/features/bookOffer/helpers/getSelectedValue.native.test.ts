import { getSelectedValue } from 'features/bookOffer/helpers/getSelectedValue'

describe('getSelectedValue', () => {
  it('should return selected hour when prices step can be displayed', () => {
    expect(
      getSelectedValue({
        hasPotentialPricesStep: true,
        selectedHour: '2023-04-01T18:00:00Z',
        selectedStockBeginningDatetime: '2023-04-01T20:00:00Z',
      })
    ).toBe('18h00')
  })

  it('should return an empty string when prices step can be displayed without selected hour', () => {
    expect(
      getSelectedValue({
        hasPotentialPricesStep: true,
        selectedStockBeginningDatetime: '2023-04-01T20:00:00Z',
      })
    ).toBe('')
  })

  it('should return selected stock hour when prices step cannot be displayed', () => {
    expect(
      getSelectedValue({
        hasPotentialPricesStep: false,
        selectedHour: '2023-04-01T18:00:00Z',
        selectedStockBeginningDatetime: '2023-04-01T20:00:00Z',
      })
    ).toBe('20h00')
  })

  it('should return an empty string when prices step cannot be displayed without selected stock hour', () => {
    expect(
      getSelectedValue({
        hasPotentialPricesStep: false,
      })
    ).toBe('')
  })
})
