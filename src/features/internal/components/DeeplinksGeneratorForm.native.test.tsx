import mockdate from 'mockdate'
import React from 'react'

import {
  DeeplinksGeneratorForm,
  getDefaultScreenParams,
} from 'features/internal/components/DeeplinksGeneratorForm'
import { ScreensUsedByMarketing } from 'features/internal/config/deeplinksExportConfig'
import { LocationMode } from 'libs/location/types'
import { render, screen, userEvent, fireEvent } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategories')

mockdate.set(new Date('2022-08-09T00:00:00Z'))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

describe('<DeeplinksGeneratorForm />', () => {
  jest.useFakeTimers()

  it('should render deeplink generator form with marketing as default utm_gen', async () => {
    const onCreate = jest.fn()
    render(<DeeplinksGeneratorForm onCreate={onCreate} />)
    const generateButton = screen.getByTestId('Générer le lien')
    const home = screen.getByText('Home')
    const profile = screen.getByText('Profile')

    await user.press(home)

    await user.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(1, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Faccueil%3Ffrom%3Ddeeplink%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink: 'https://webapp-v2.example.com/accueil?from=deeplink&utm_gen=marketing',
    })

    await user.press(profile)

    await user.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(2, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Fprofil%3Ffrom%3Ddeeplink%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink: 'https://webapp-v2.example.com/profil?from=deeplink&utm_gen=marketing',
    })
  })

  it('should create url with utm params', async () => {
    const onCreate = jest.fn()
    render(<DeeplinksGeneratorForm onCreate={onCreate} />)

    fireEvent.changeText(screen.getByPlaceholderText('utm_gen (*)'), 'product')
    fireEvent.changeText(screen.getByPlaceholderText('utm_campaign'), 'campaign')
    fireEvent.changeText(screen.getByPlaceholderText('utm_source'), 'source')
    fireEvent.changeText(screen.getByPlaceholderText('utm_medium'), 'medium')
    await user.press(screen.getByText('Générer le lien'))

    expect(onCreate).toHaveBeenNthCalledWith(1, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Faccueil%3Futm_gen%3Dproduct%26utm_campaign%3Dcampaign%26utm_source%3Dsource%26utm_medium%3Dmedium&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/accueil?utm_gen=product&utm_campaign=campaign&utm_source=source&utm_medium=medium',
    })
  })

  it('should add showResults param when the user generate a search link', async () => {
    const onCreate = jest.fn()
    render(<DeeplinksGeneratorForm onCreate={onCreate} />)
    const generateButton = screen.getByTestId('Générer le lien')
    const search = screen.getByText('SearchResults')

    await user.press(search)

    await user.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(1, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%2Fresultats%3FlocationFilter%3D%255Bobject%2520Object%255D%26from%3Ddeeplink%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche/resultats?locationFilter=%5Bobject%20Object%5D&from=deeplink&utm_gen=marketing',
    })
  })

  it('should remove subcategory param when the user change the category and generate a search link', async () => {
    const onCreate = jest.fn()
    render(<DeeplinksGeneratorForm onCreate={onCreate} />)

    const search = screen.getByText('SearchResults')
    await user.press(search)

    let categoryButton = screen.getByText('Arts & loisirs créatifs')
    await user.press(categoryButton)

    const subcategoryButton = screen.getByText('Arts visuels')
    await user.press(subcategoryButton)

    let generateButton = screen.getByText('Générer le lien')
    await user.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(1, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%2Fresultats%3FlocationFilter%3D%255Bobject%2520Object%255D%26from%3Ddeeplink%26offerCategories%3DARTS_LOISIRS_CREATIFS%26offerNativeCategories%3DARTS_VISUELS%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche/resultats?locationFilter=%5Bobject%20Object%5D&from=deeplink&offerCategories=ARTS_LOISIRS_CREATIFS&offerNativeCategories=ARTS_VISUELS&utm_gen=marketing',
    })

    categoryButton = screen.getByText('Concerts & festivals')
    await user.press(categoryButton)

    generateButton = screen.getByText('Générer le lien')
    await user.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(2, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%2Fresultats%3FlocationFilter%3D%255Bobject%2520Object%255D%26from%3Ddeeplink%26offerCategories%3DCONCERTS_FESTIVALS%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche/resultats?locationFilter=%5Bobject%20Object%5D&from=deeplink&offerCategories=CONCERTS_FESTIVALS&utm_gen=marketing',
    })
  })

  it("should have disabled button when a category isn't selected in ThematicSearch", async () => {
    const onCreate = jest.fn()
    render(<DeeplinksGeneratorForm onCreate={onCreate} />)

    const thematicSearch = screen.getByText('ThematicSearch')
    await user.press(thematicSearch)
    const generateButton = screen.getByText('Générer le lien')

    expect(generateButton).toBeDisabled()
  })

  it('should generate link when a category is selected in ThematicSearch', async () => {
    const onCreate = jest.fn()
    render(<DeeplinksGeneratorForm onCreate={onCreate} />)

    const thematicSearch = screen.getByText('ThematicSearch')
    await user.press(thematicSearch)

    const categoryButton = screen.getByText('Cinéma')
    await user.press(categoryButton)

    const generateButton = screen.getByText('Générer le lien')
    await user.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(1, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2FThematicSearch%3Ffrom%3Ddeeplink%26offerCategories%3DCINEMA%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/ThematicSearch?from=deeplink&offerCategories=CINEMA&utm_gen=marketing',
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

  it.each(['Offer', 'Venue', 'Home', 'Profile', 'SignupForm', 'ThematicHome', 'ThematicSearch'])(
    'should return an object with from param set to "deeplink" when screen is %s',
    (screen) => {
      const defaultParams = getDefaultScreenParams(screen as ScreensUsedByMarketing)

      expect(defaultParams).toEqual({
        from: 'deeplink',
      })
    }
  )
})
