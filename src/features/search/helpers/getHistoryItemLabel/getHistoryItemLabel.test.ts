import {
  getHistoryItemLabel,
  GetHistoryItemLabelProps,
} from 'features/search/helpers/getHistoryItemLabel/getHistoryItemLabel'

const defaultProps: GetHistoryItemLabelProps = {
  query: 'one piece',
}

describe('getHistoryItemLabel', () => {
  it('should return only query information in accessibility label when item has not category and native category', () => {
    const historyItemLabel = getHistoryItemLabel(defaultProps)

    expect(historyItemLabel).toEqual('one piece')
  })

  it('should return query and category information in accessibility label when item has category and has not native category', () => {
    const historyItemLabel = getHistoryItemLabel({
      ...defaultProps,
      category: 'Livres',
    })

    expect(historyItemLabel).toEqual('one piece dans Livres')
  })

  it('should return query and native category information in accessibility label when item has native category and has not category', () => {
    const historyItemLabel = getHistoryItemLabel({
      ...defaultProps,
      nativeCategory: 'Livres papier',
    })

    expect(historyItemLabel).toEqual('one piece dans Livres papier')
  })

  it('should return query and native category information in accessibility label when item has category and native category', () => {
    const historyItemLabel = getHistoryItemLabel({
      ...defaultProps,
      category: 'Livres',
      nativeCategory: 'Livres papier',
    })

    expect(historyItemLabel).toEqual('one piece dans Livres papier')
  })
})
