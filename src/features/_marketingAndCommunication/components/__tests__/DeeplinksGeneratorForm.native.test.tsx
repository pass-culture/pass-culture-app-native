import mockdate from 'mockdate'
import React from 'react'

import { DeeplinksGeneratorForm } from 'features/_marketingAndCommunication/components/DeeplinksGeneratorForm'
import { render, fireEvent } from 'tests/utils'

mockdate.set(new Date('2022-08-09T00:00:00Z'))

describe('<DeeplinksGeneratorForm />', () => {
  it('should render deeplink generator form', () => {
    const onCreate = jest.fn()
    const renderAPI = render(<DeeplinksGeneratorForm onCreate={onCreate} />)
    const generateButton = renderAPI.getByTestId('Générer le lien')
    const home = renderAPI.getByText('Home')
    const profile = renderAPI.getByText('Profile')

    fireEvent.press(home)

    fireEvent.press(generateButton)

    expect(onCreate).toHaveBeenNthCalledWith(1, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Faccueil&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink: 'https://webapp-v2.example.com/accueil',
    })

    fireEvent.press(profile)

    fireEvent.press(generateButton)
    expect(onCreate).toHaveBeenNthCalledWith(2, {
      firebaseLink:
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Fprofil&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink: 'https://webapp-v2.example.com/profil',
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
        'https://passcultureapptesting.page.link/?link=https%3A%2F%2Fwebapp-v2.example.com%2Frecherche%3Fview%3D%2522Results%2522%26showResults%3Dtrue%26beginningDatetime%3D%25222022-08-09T00%253A00%253A00.000Z%2522%26endingDatetime%3D%25222022-08-09T00%253A00%253A00.000Z%2522&apn=app.android&isi=1557887412&ibi=app.ios&efr=1',
      universalLink:
        'https://webapp-v2.example.com/recherche?view=%22Results%22&showResults=true&beginningDatetime=%222022-08-09T00%3A00%3A00.000Z%22&endingDatetime=%222022-08-09T00%3A00%3A00.000Z%22',
    })
  })
})
