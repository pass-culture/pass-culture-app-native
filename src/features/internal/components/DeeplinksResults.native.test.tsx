import React from 'react'

import { DeeplinksResult } from 'features/internal/components/DeeplinksResult'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('<DeeplinksResult />', () => {
  const universalLink =
    'https://passcultureapp.page.link/?link=https%3A%2F%2Fpassculture.app%2Frecherche&apn=app.passculture.webapp&isi=1557887412&ibi=app.passculture&efr=1'

  it('should display deeplinks results', () => {
    render(<DeeplinksResult result={universalLink} />)

    expect(screen.getByText(universalLink)).toBeOnTheScreen()
  })

  it('should display message when no results are provided', async () => {
    render(<DeeplinksResult />)

    expect(screen.getByText(`Vous devez d’abord générer un lien`)).toBeOnTheScreen()
  })
})
