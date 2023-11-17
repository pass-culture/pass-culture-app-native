import algoliasearch from 'algoliasearch'

import {
  buildAlgoliaFilter,
  fetchOffersByArtist,
} from 'features/offer/components/SameArtistPlaylist/api/fetchOffersByArtist'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'

jest.mock('algoliasearch')

const mockInitIndex = algoliasearch('', '').initIndex
const search = mockInitIndex('').search as jest.Mock

describe('fetchOffersByArtist', () => {
  it('should execute the query if both artist and ean are provided', async () => {
    await fetchOffersByArtist({ artists: 'Eiichiro Oda', ean: '9782723492607' })

    expect(search).toHaveBeenCalledWith('', {
      page: 0,
      filters: `offer.artist:"Eiichiro Oda" AND NOT offer.ean:"9782723492607"`,
      hitsPerPage: 30,
      attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.artist', 'offer.ean'],
      attributesToHighlight: [],
    })
  })

  it('should not execute the query if both artist and ean are missing', async () => {
    await fetchOffersByArtist({ artists: '', ean: '' })

    expect(search).not.toHaveBeenCalled()
  })

  it('should execute the query with only artist', async () => {
    await fetchOffersByArtist({ artists: 'Eiichiro Oda', ean: '' })

    expect(search).toHaveBeenCalledWith('', {
      page: 0,
      filters: 'offer.artist:"Eiichiro Oda"',
      hitsPerPage: 30,
      attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.artist', 'offer.ean'],
      attributesToHighlight: [],
    })
  })

  it('should not execute the query with only ean', async () => {
    await fetchOffersByArtist({ artists: '', ean: '9782723492607' })

    expect(search).not.toHaveBeenCalled()
  })
})

describe('buildAlgoliaFilter', () => {
  it('should build the correct filter when ean is provided', () => {
    const filter = buildAlgoliaFilter({
      artists: 'Eiichiro Oda',
      ean: '9782344037102',
    })

    expect(filter).toEqual('offer.artist:"Eiichiro Oda" AND NOT offer.ean:"9782344037102"')
  })

  it('should build the correct filter when ean is not provided', () => {
    const filter = buildAlgoliaFilter({
      artists: 'Eiichiro Oda',
      ean: undefined,
    })

    expect(filter).toEqual('offer.artist:"Eiichiro Oda"')
  })

  it('should handle multiple artists and ean', () => {
    const filter = buildAlgoliaFilter({
      artists: 'Eiichiro Oda ; Another Artist',
      ean: '9782344037102',
    })

    expect(filter).toEqual('offer.artist:"Eiichiro Oda" AND NOT offer.ean:"9782344037102"')
  })
})
