import React from 'react'

import { DeeplinksGeneratorForm } from 'features/_marketingAndCommunication/components/DeeplinksGeneratorForm'
import { render, fireEvent } from 'tests/utils'

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
})
