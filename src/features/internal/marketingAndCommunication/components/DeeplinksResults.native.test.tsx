import React from 'react'

import { GeneratedDeeplink } from 'features/internal/marketingAndCommunication/components/DeeplinksGeneratorForm'
import { DeeplinksResult } from 'features/internal/marketingAndCommunication/components/DeeplinksResult'
import { render } from 'tests/utils'

describe('<DeeplinksResult />', () => {
  const result: GeneratedDeeplink = {
    firebaseLink: 'https://passculture.app/recherche',
    universalLink:
      'https://passcultureapp.page.link/?link=https%3A%2F%2Fpassculture.app%2Frecherche&apn=app.passculture.webapp&isi=1557887412&ibi=app.passculture&efr=1',
  }

  it('should display deeplinks results', () => {
    const renderAPI = render(<DeeplinksResult result={result} />)
    expect(renderAPI.getByText(result.firebaseLink)).toBeTruthy()
    expect(renderAPI.getByText(result.universalLink)).toBeTruthy()
  })

  it('should display message when no results are provided', async () => {
    const renderAPI = render(<DeeplinksResult />)
    expect(renderAPI.getByText(`Vous devez d’abord générer un lien`)).toBeTruthy()
  })
})
