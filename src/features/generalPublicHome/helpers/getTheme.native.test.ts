import { SearchGroupNameEnumv2 } from 'api/gen'
import { getTheme } from 'features/generalPublicHome/helpers/getTheme'

describe('getTheme', () => {
  it('should return the theme matching the id', () => {
    expect(getTheme('cinema')).toEqual({
      id: 'cinema',
      label: 'Cinéma',
      categories: ['Cinéma'],
      searchGroup: SearchGroupNameEnumv2.CINEMA,
    })
  })

  it('should return undefined without id', () => {
    expect(getTheme()).toBeUndefined()
  })
})
