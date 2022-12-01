import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment'
import { flushAllPromisesWithAct, render, fireEvent } from 'tests/utils'

import { LegalNotices } from './LegalNotices'

async function renderProfile() {
  const wrapper = render(<LegalNotices />)
  await flushAllPromisesWithAct()
  return wrapper
}

describe('LegalNotices', () => {
  it('should render correctly', async () => {
    const renderAPI = await renderProfile()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate when the cgu row is clicked', async () => {
    const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
    const { getByText } = await renderProfile()

    const row = getByText('Conditions Générales d’Utilisation')
    fireEvent.press(row)

    expect(openUrl).toBeCalledWith(env.CGU_LINK, undefined)
  })
  it('should navigate when the data-privacy-chart row is clicked', async () => {
    const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
    const { getByText } = await renderProfile()

    const row = getByText('Charte de protection des données personnelles')
    fireEvent.press(row)

    expect(openUrl).toBeCalledWith(env.DATA_PRIVACY_CHART_LINK, undefined)
  })
})
