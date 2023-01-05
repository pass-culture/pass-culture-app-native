import { getNavigateToThematicHomeConfig } from './getNavigateToThematicHomeConfig'

describe('getNavigateToThematicHomeConfig', () => {
  it('should return correct navigation config when an entry id is provided', () => {
    const navigateTo = getNavigateToThematicHomeConfig('entry-id')

    expect(navigateTo).toEqual({
      params: {
        params: { entryId: 'entry-id' },
        screen: 'Home',
      },
      screen: 'TabNavigator',
    })
  })
})
