import { extractOfferIdsFromHits } from './extractOfferIdsFromHits'

describe('extractOfferIdsFromHits', () => {
  it('extracts numeric offer ids', () => {
    expect(
      extractOfferIdsFromHits([{ objectID: '1' }, { objectID: '2' }] as Parameters<
        typeof extractOfferIdsFromHits
      >[0])
    ).toEqual([1, 2])
  })

  it('returns an empty list when there are no hits', () => {
    expect(extractOfferIdsFromHits()).toEqual([])
  })
})
