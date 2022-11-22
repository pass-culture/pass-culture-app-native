import { SplashScreenProvider, useSplashScreenContext } from 'libs/splashscreen/splashscreen'
import { renderHook } from 'tests/utils'

describe('useSplashScreenContext()', () => {
  it('should always have a hidden splashscreen', () => {
    const { result } = renderHook(useSplashScreenContext, {
      wrapper: SplashScreenProvider,
    })

    expect(result.current).toEqual({
      isSplashScreenHidden: true,
      hideSplashScreen: undefined,
    })
  })
})
