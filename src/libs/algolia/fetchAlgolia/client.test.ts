import { liteClient } from 'algoliasearch/lite'

import { client } from 'libs/algolia/fetchAlgolia/clients'

jest.mock('algoliasearch/lite')

describe('[fetchAlgolia] client', () => {
  it('should not instanciate the client at module load', () => {
    expect(liteClient).not.toHaveBeenCalled()
  })

  it('should instanciate the client on first use', () => {
    const mockSearch = jest.fn()
    ;(liteClient as jest.Mock).mockReturnValueOnce({ search: mockSearch })

    void client.search({ requests: [] })

    expect(liteClient).toHaveBeenCalledWith('algoliaAppId', 'algoliaApiKey')
    expect(mockSearch).toHaveBeenCalledWith({ requests: [] }, undefined)
  })
})
