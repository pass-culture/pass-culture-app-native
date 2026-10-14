import { getTheme } from 'features/generalPublicHome/helpers/getTheme'
import { Cinema } from 'ui/svg/icons/venueAndCategories/Cinema'

describe('getTheme', () => {
  it('should return the theme matching the id', () => {
    expect(getTheme('cinema')).toEqual({
      id: 'cinema',
      label: 'Cinéma',
      Icon: Cinema,
      categories: ['Cinéma'],
    })
  })

  it('should return undefined without id', () => {
    expect(getTheme()).toBeUndefined()
  })
})
