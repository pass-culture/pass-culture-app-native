import { getNavigateToThematicHomeConfig } from './getNavigateToThematicHomeConfig'

describe('getNavigateToThematicHomeConfig', () => {
  it('should return correct navigation config when an entry id is provided', () => {
    const navigateTo = getNavigateToThematicHomeConfig('entry-id')

    expect(navigateTo).toEqual({
      params: {
        homeId: 'entry-id',
      },
      screen: 'ThematicHome',
    })
  })
})
