import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment'
import { render, fireEvent, screen } from 'tests/utils'

import { LegalNotices } from './LegalNotices'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('LegalNotices', () => {
  it('should render correctly', async () => {
    const renderAPI = render(<LegalNotices />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate when the cgu row is clicked', async () => {
    render(<LegalNotices />)

    const row = screen.getByText('Conditions Générales d’Utilisation')
    fireEvent.press(row)

    expect(openUrl).toHaveBeenCalledWith(env.CGU_LINK, undefined, true)
  })
  it('should navigate when the data-privacy-chart row is clicked', async () => {
    render(<LegalNotices />)

    const row = screen.getByText('Charte de protection des données personnelles')
    fireEvent.press(row)

    expect(openUrl).toHaveBeenCalledWith(env.DATA_PRIVACY_CHART_LINK, undefined, true)
  })
})
