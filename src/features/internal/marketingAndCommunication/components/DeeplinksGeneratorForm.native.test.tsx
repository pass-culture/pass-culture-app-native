import mockdate from 'mockdate'
import React from 'react'

import {
  DeeplinksGeneratorForm,
  getDefaultScreenParams,
} from 'features/internal/marketingAndCommunication/components/DeeplinksGeneratorForm'
import { ScreensUsedByMarketing } from 'features/internal/marketingAndCommunication/config/deeplinksExportConfig'
import { LocationMode } from 'libs/location/types'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategories')

mockdate.set(new Date('2022-08-09T00:00:00Z'))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/TabBar/routes')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<DeeplinksGeneratorForm />', () => {
  it('should render deeplink generator form with marketing as default utm_gen', () => {
    const onCreate = jest.fn()
    render(<DeeplinksGeneratorForm onCreate={onCreate} />)
    const generateButton = screen.getByTestId('Générer le lien')
    const home = screen.getByText('Home')
    const profile = screen.getByText('Profile')

    fireEvent.press(home)

    fireEvent.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(1, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Faccueil%3Ffrom%3Ddeeplink%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink: 'https://webapp-v2.example.com/accueil?from=deeplink&utm_gen=marketing',
    })

    fireEvent.press(profile)

    fireEvent.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(2, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Fprofil%3Ffrom%3Ddeeplink%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink: 'https://webapp-v2.example.com/profil?from=deeplink&utm_gen=marketing',
    })
  })

  it('should create url with utm params', () => {
    const onCreate = jest.fn()
    render(<DeeplinksGeneratorForm onCreate={onCreate} />)

    fireEvent.changeText(screen.getByPlaceholderText('utm_gen (*)'), 'product')
    fireEvent.changeText(screen.getByPlaceholderText('utm_campaign'), 'campaign')
    fireEvent.changeText(screen.getByPlaceholderText('utm_source'), 'source')
    fireEvent.changeText(screen.getByPlaceholderText('utm_medium'), 'medium')
    fireEvent.press(screen.getByText('Générer le lien'))

    expect(onCreate).toHaveBeenNthCalledWith(1, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Faccueil%3Futm_gen%3Dproduct%26utm_campaign%3Dcampaign%26utm_source%3Dsource%26utm_medium%3Dmedium&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/accueil?utm_gen=product&utm_campaign=campaign&utm_source=source&utm_medium=medium',
    })
  })

  it('should add showResults param when the user generate a search link', () => {
    const onCreate = jest.fn()
    render(<DeeplinksGeneratorForm onCreate={onCreate} />)
    const generateButton = screen.getByTestId('Générer le lien')
    const search = screen.getByText('SearchResults')

    fireEvent.press(search)

    fireEvent.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(1, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%2Fresultats%3FlocationFilter%3D%255Bobject%2520Object%255D%26from%3Ddeeplink%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche/resultats?locationFilter=%5Bobject%20Object%5D&from=deeplink&utm_gen=marketing',
    })
  })

  it('should remove subcategory param when the user change the category and generate a search link', () => {
    const onCreate = jest.fn()
    render(<DeeplinksGeneratorForm onCreate={onCreate} />)

    const search = screen.getByText('SearchResults')
    fireEvent.press(search)

    let categoryButton = screen.getByText('Arts & loisirs créatifs')
    fireEvent.press(categoryButton)

    const subcategoryButton = screen.getByText('Arts visuels')
    fireEvent.press(subcategoryButton)

    let generateButton = screen.getByText('Générer le lien')
    fireEvent.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(1, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%2Fresultats%3FlocationFilter%3D%255Bobject%2520Object%255D%26from%3Ddeeplink%26offerCategories%3DARTS_LOISIRS_CREATIFS%26offerNativeCategories%3DARTS_VISUELS%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche/resultats?locationFilter=%5Bobject%20Object%5D&from=deeplink&offerCategories=ARTS_LOISIRS_CREATIFS&offerNativeCategories=ARTS_VISUELS&utm_gen=marketing',
    })

    categoryButton = screen.getByText('Concerts & festivals')
    fireEvent.press(categoryButton)

    generateButton = screen.getByText('Générer le lien')
    fireEvent.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(2, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%2Fresultats%3FlocationFilter%3D%255Bobject%2520Object%255D%26from%3Ddeeplink%26offerCategories%3DCONCERTS_FESTIVALS%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche/resultats?locationFilter=%5Bobject%20Object%5D&from=deeplink&offerCategories=CONCERTS_FESTIVALS&utm_gen=marketing',
    })
  })
})

jest.mock('libs/firebase/analytics/analytics')

describe('getDefaultScreenParams', () => {
  it('should return an object with view, locationFilter, from params when screen is Search', () => {
    const defaultParams = getDefaultScreenParams('SearchResults')

    expect(defaultParams).toEqual({
      locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: 'all' },
      from: 'deeplink',
    })
  })

  it.each(['Offer', 'Venue', 'Home', 'Profile', 'SignupForm', 'ThematicHome'])(
    'should return an object with from param set to "deeplink" when screen is %s',
    (screen) => {
      const defaultParams = getDefaultScreenParams(screen as ScreensUsedByMarketing)

      expect(defaultParams).toEqual({
        from: 'deeplink',
      })
    }
  )
})
