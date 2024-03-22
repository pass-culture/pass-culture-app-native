import { RootStack } from 'features/navigation/RootNavigator/Stack'
import { RootRoute } from 'features/navigation/RootNavigator/types'

import { getScreensAndConfig } from '../getScreensConfig'

const parse = (value: string) => value
const DummyComponent = () => null
const validRoutes = [
  {
    name: 'Offer',
    component: DummyComponent,
    path: 'offer',
    deeplinkPaths: ['offre1', 'offre2'],
    options: { title: 'Offer title' },
  },
  {
    name: 'Login',
    component: DummyComponent,
    pathConfig: {
      path: 'login',
      deeplinkPaths: ['connexion'],
      parse,
    },
    options: { title: 'Login title' },
  },
] as RootRoute[]

describe('getScreensAndConfig()', () => {
  it('should throw if a screen without path or pathConfig is encountered', () => {
    const invalidRoutes = [
      {
        name: 'Offer',
        component: DummyComponent,
        deeplinkPaths: ['offre1', 'offre2'],
        options: { title: 'Offer title' },
      },
    ] as RootRoute[]

    expect(() => getScreensAndConfig(invalidRoutes, RootStack.Screen)).toThrow(
      new Error('Screen Offer: you have to declare either path or pathConfig')
    )
  })

  it('should throw if a screen is defined with both path and pathConfig is encountered', () => {
    const invalidRoutes = [
      {
        name: 'Offer',
        component: DummyComponent,
        path: 'offer',
        pathConfig: { path: 'offer' },
        deeplinkPaths: ['offre1', 'offre2'],
        options: { title: 'Offer title' },
      },
    ] as RootRoute[]

    expect(() => getScreensAndConfig(invalidRoutes, RootStack.Screen)).toThrow(
      new Error('Screen Offer: you cannot declare both path and pathConfig')
    )
  })

  it('should return a screensConfig and Screens components', () => {
    const { screensConfig, Screens } = getScreensAndConfig(validRoutes, RootStack.Screen)

    expect(screensConfig).toEqual({
      Offer: { path: 'offer' },
      _DeeplinkOnlyOffer1: { path: 'offre1' },
      _DeeplinkOnlyOffer2: { path: 'offre2' },
      Login: { path: 'login', parse },
      _DeeplinkOnlyLogin1: { path: 'connexion', parse },
    })
    expect(Screens).toHaveLength(5)
    // @ts-expect-error: because of noUncheckedIndexedAccess
    expect(Screens[0].props).toEqual({
      name: 'Offer',
      component: expect.any(Object),
      options: { title: 'Offer title' },
    })
    // @ts-expect-error: because of noUncheckedIndexedAccess
    expect(Screens[1].props).toEqual({
      name: '_DeeplinkOnlyOffer1',
      component: expect.any(Object),
      options: { title: 'Offer title' },
    })
    // @ts-expect-error: because of noUncheckedIndexedAccess
    expect(Screens[2].props).toEqual({
      name: '_DeeplinkOnlyOffer2',
      component: expect.any(Object),
      options: { title: 'Offer title' },
    })
    // @ts-expect-error: because of noUncheckedIndexedAccess
    expect(Screens[3].props).toEqual({
      name: 'Login',
      component: expect.any(Object),
      options: { title: 'Login title' },
    })
    // @ts-expect-error: because of noUncheckedIndexedAccess
    expect(Screens[4].props).toEqual({
      name: '_DeeplinkOnlyLogin1',
      component: expect.any(Object),
      options: { title: 'Login title' },
    })
  })
})
