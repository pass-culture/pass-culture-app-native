import algoliasearch from 'algoliasearch'

import { fetchOffersByArtist } from 'features/offer/components/SameArtistPlaylist/api/fetchOffersByArtist'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'

jest.mock('algoliasearch')

const mockInitIndex = algoliasearch('', '').initIndex
const search = mockInitIndex('').search as jest.Mock

describe('fetchOffersByArtist', () => {
  it('should execute the query if both artist and ean are provided', async () => {
    await fetchOffersByArtist({ artist: 'Eiichiro Oda', ean: '9782723492607' })

    expect(search).toHaveBeenCalledWith('', {
      page: 0,
      filters: `offer.artist:"Eiichiro Oda" AND NOT offer.ean:"9782723492607"`,
      hitsPerPage: 30,
      attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.artist', 'offer.ean'],
      attributesToHighlight: [],
    })
  })

  it('should not execute the query if both artist and ean are missing', async () => {
    await fetchOffersByArtist({ artist: '', ean: '' })

    expect(search).not.toHaveBeenCalled()
  })

  it('should not execute the query with only artist', async () => {
    await fetchOffersByArtist({ artist: 'Eiichiro Oda', ean: '' })

    expect(search).not.toHaveBeenCalled()
  })

  it('should not  execute the query with only ean', async () => {
    await fetchOffersByArtist({ artist: '', ean: '9782723492607' })

    expect(search).not.toHaveBeenCalled()
  })
})
