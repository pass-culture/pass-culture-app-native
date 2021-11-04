import algoliasearch from 'algoliasearch'

jest.mock('algoliasearch')

describe('[fetchAlgolia] client', () => {
  it('should instanciate new client', () => {
    require('../fetchAlgolia/clients')
    expect(algoliasearch).toHaveBeenCalledWith('algoliaAppId', 'algoliaApiKey')
  })
})
