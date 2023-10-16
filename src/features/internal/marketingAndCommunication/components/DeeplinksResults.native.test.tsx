import React from 'react'

import { GeneratedDeeplink } from 'features/internal/marketingAndCommunication/components/DeeplinksGeneratorForm'
import { DeeplinksResult } from 'features/internal/marketingAndCommunication/components/DeeplinksResult'
import { render, screen } from 'tests/utils'

describe('<DeeplinksResult />', () => {
  const result: GeneratedDeeplink = {
    firebaseLink: 'https://passculture.app/recherche',
    universalLink:
      'https://passcultureapp.page.link/?link=https%3A%2F%2Fpassculture.app%2Frecherche&apn=app.passculture.webapp&isi=1557887412&ibi=app.passculture&efr=1',
  }

  it('should display deeplinks results', () => {
    render(<DeeplinksResult result={result} />)
    expect(screen.getByText(result.firebaseLink)).toBeOnTheScreen()
    expect(screen.getByText(result.universalLink)).toBeOnTheScreen()
  })

  it('should display message when no results are provided', async () => {
    render(<DeeplinksResult />)
    expect(screen.getByText(`Vous devez d’abord générer un lien`)).toBeOnTheScreen()
  })
})
