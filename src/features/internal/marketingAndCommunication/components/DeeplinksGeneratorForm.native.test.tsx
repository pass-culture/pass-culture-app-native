import mockdate from 'mockdate'
import React from 'react'

import {
  DeeplinksGeneratorForm,
  getDefaultScreenParams,
} from 'features/internal/marketingAndCommunication/components/DeeplinksGeneratorForm'
import { ScreensUsedByMarketing } from 'features/internal/marketingAndCommunication/config/deeplinksExportConfig'
import { LocationType } from 'features/search/enums'
import { SearchView } from 'features/search/types'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

mockdate.set(new Date('2022-08-09T00:00:00Z'))

describe('<DeeplinksGeneratorForm />', () => {
  it('should render deeplink generator form with marketing as default utm_gen', () => {
    const onCreate = jest.fn()
    const renderAPI = render(<DeeplinksGeneratorForm onCreate={onCreate} />)
    const generateButton = renderAPI.getByTestId('Générer le lien')
    const home = renderAPI.getByText('Home')
    const profile = renderAPI.getByText('Profile')

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
    const renderAPI = render(<DeeplinksGeneratorForm onCreate={onCreate} />)
    const generateButton = renderAPI.getByTestId('Générer le lien')
    const search = renderAPI.getByText('Search')

    fireEvent.press(search)

    fireEvent.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(1, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%3Fview%3D%2522Results%2522%26showResults%3Dtrue%26locationFilter%3D%257B%2522locationType%2522%253A%2522EVERYWHERE%2522%257D%26noFocus%3Dtrue%26from%3Ddeeplink%26beginningDatetime%3D%25222022-08-09T00%253A00%253A00.000Z%2522%26endingDatetime%3D%25222022-08-09T00%253A00%253A00.000Z%2522%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche?view=%22Results%22&showResults=true&locationFilter=%7B%22locationType%22%3A%22EVERYWHERE%22%7D&noFocus=true&from=deeplink&beginningDatetime=%222022-08-09T00%3A00%3A00.000Z%22&endingDatetime=%222022-08-09T00%3A00%3A00.000Z%22&utm_gen=marketing',
    })
  })

  it('should remove subcategory param when the user change the category and generate a search link', () => {
    const onCreate = jest.fn()
    const { getByText } = render(<DeeplinksGeneratorForm onCreate={onCreate} />)

    const search = getByText('Search')
    fireEvent.press(search)

    let categoryButton = getByText('Arts & loisirs créatifs')
    fireEvent.press(categoryButton)

    const subcategoryButton = getByText('Arts visuels')
    fireEvent.press(subcategoryButton)

    let generateButton = getByText('Générer le lien')
    fireEvent.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(1, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%3Fview%3D%2522Results%2522%26showResults%3Dtrue%26locationFilter%3D%257B%2522locationType%2522%253A%2522EVERYWHERE%2522%257D%26noFocus%3Dtrue%26from%3Ddeeplink%26beginningDatetime%3D%25222022-08-09T00%253A00%253A00.000Z%2522%26endingDatetime%3D%25222022-08-09T00%253A00%253A00.000Z%2522%26offerCategories%3D%255B%2522ARTS_LOISIRS_CREATIFS%2522%255D%26offerNativeCategories%3D%255B%2522ARTS_VISUELS%2522%255D%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche?view=%22Results%22&showResults=true&locationFilter=%7B%22locationType%22%3A%22EVERYWHERE%22%7D&noFocus=true&from=deeplink&beginningDatetime=%222022-08-09T00%3A00%3A00.000Z%22&endingDatetime=%222022-08-09T00%3A00%3A00.000Z%22&offerCategories=%5B%22ARTS_LOISIRS_CREATIFS%22%5D&offerNativeCategories=%5B%22ARTS_VISUELS%22%5D&utm_gen=marketing',
    })

    categoryButton = getByText('Concerts & festivals')
    fireEvent.press(categoryButton)

    generateButton = getByText('Générer le lien')
    fireEvent.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(2, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%3Fview%3D%2522Results%2522%26showResults%3Dtrue%26locationFilter%3D%257B%2522locationType%2522%253A%2522EVERYWHERE%2522%257D%26noFocus%3Dtrue%26from%3Ddeeplink%26beginningDatetime%3D%25222022-08-09T00%253A00%253A00.000Z%2522%26endingDatetime%3D%25222022-08-09T00%253A00%253A00.000Z%2522%26offerCategories%3D%255B%2522CONCERTS_FESTIVALS%2522%255D%26utm_gen%3Dmarketing&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche?view=%22Results%22&showResults=true&locationFilter=%7B%22locationType%22%3A%22EVERYWHERE%22%7D&noFocus=true&from=deeplink&beginningDatetime=%222022-08-09T00%3A00%3A00.000Z%22&endingDatetime=%222022-08-09T00%3A00%3A00.000Z%22&offerCategories=%5B%22CONCERTS_FESTIVALS%22%5D&utm_gen=marketing',
    })
  })
})

describe('getDefaultScreenParams', () => {
  it('should return an object with view, locationFilter, noFocus, from params when screen is Search', () => {
    const defaultParams = getDefaultScreenParams('Search')
    expect(defaultParams).toEqual({
      view: SearchView.Results,
      locationFilter: { locationType: LocationType.EVERYWHERE },
      noFocus: true,
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
