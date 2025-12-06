import { liteClient } from 'algoliasearch/lite'

jest.mock('algoliasearch/lite')

describe('[fetchAlgolia] client', () => {
  it('should instanciate new client', () => {
    require('../fetchAlgolia/clients')

    expect(liteClient).toHaveBeenCalledWith('algoliaAppId', 'algoliaApiKey')
  })
})
