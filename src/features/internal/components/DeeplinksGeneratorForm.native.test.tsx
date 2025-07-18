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
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%2Fresultats%3FlocationFilter%3D%257B%2522locationType%2522%253A%2522AROUND_ME%2522%252C%2522aroundRadius%2522%253A%2522all%2522%257D%26from%3Ddeeplink%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche/resultats?locationFilter=%7B%22locationType%22%3A%22AROUND_ME%22%2C%22aroundRadius%22%3A%22all%22%7D&from=deeplink&utm_gen=marketing',
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
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%2Fresultats%3FlocationFilter%3D%257B%2522locationType%2522%253A%2522AROUND_ME%2522%252C%2522aroundRadius%2522%253A%2522all%2522%257D%26from%3Ddeeplink%26offerCategories%3D%255B%2522ARTS_LOISIRS_CREATIFS%2522%255D%26offerNativeCategories%3D%255B%2522ARTS_VISUELS%2522%255D%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche/resultats?locationFilter=%7B%22locationType%22%3A%22AROUND_ME%22%2C%22aroundRadius%22%3A%22all%22%7D&from=deeplink&offerCategories=%5B%22ARTS_LOISIRS_CREATIFS%22%5D&offerNativeCategories=%5B%22ARTS_VISUELS%22%5D&utm_gen=marketing',
    })

    categoryButton = screen.getByText('Concerts & festivals')
    await user.press(categoryButton)

    generateButton = screen.getByText('Générer le lien')
    await user.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(2, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%2Fresultats%3FlocationFilter%3D%257B%2522locationType%2522%253A%2522AROUND_ME%2522%252C%2522aroundRadius%2522%253A%2522all%2522%257D%26from%3Ddeeplink%26offerCategories%3D%255B%2522CONCERTS_FESTIVALS%2522%255D%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche/resultats?locationFilter=%7B%22locationType%22%3A%22AROUND_ME%22%2C%22aroundRadius%22%3A%22all%22%7D&from=deeplink&offerCategories=%5B%22CONCERTS_FESTIVALS%22%5D&utm_gen=marketing',
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
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%2Fthematique%3Ffrom%3Ddeeplink%26offerCategories%3D%255B%2522CINEMA%2522%255D%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche/thematique?from=deeplink&offerCategories=%5B%22CINEMA%22%5D&utm_gen=marketing',
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
