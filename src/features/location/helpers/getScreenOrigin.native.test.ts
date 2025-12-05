import { ScreenOrigin } from 'features/location/enums'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'

import { getScreenOrigin } from './getScreenOrigin'

describe('getScreenOrigin', () => {
  it('should return the screenOrigin param if present', () => {
    const navigation = {
      getState: () => ({
        routes: [
          { name: 'Home' },
          {
            name: 'LocationModal',
            params: { screenOrigin: 'search' },
          },
        ],
      }),
    } as UseNavigationType

    expect(getScreenOrigin(navigation)).toBe(ScreenOrigin.SEARCH)
  })

  it('should return undefined if LocationModal route has no params', () => {
    const navigation = {
      getState: () => ({
        routes: [{ name: 'LocationModal' }],
      }),
    } as UseNavigationType

    expect(getScreenOrigin(navigation)).toBeUndefined()
  })
})
