import React from 'react'
import { UseQueryResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment'
import { flushAllPromises, render, act, fireEvent } from 'tests/utils/web'

import { LegalNotices } from '../LegalNotices'

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(
    () =>
      ({
        isLoading: false,
        data: { email: 'email2@domain.ext', firstName: 'Jean', isBeneficiary: false },
      } as UseQueryResult<UserProfileResponse>)
  ),
}))

async function renderProfile() {
  const wrapper = render(<LegalNotices />)
  await act(async () => {
    await flushAllPromises()
  })
  return wrapper
}

describe('LegalNotices', () => {
  it('should render correctly', async () => {
    const renderAPI = await renderProfile()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate when the cgu row is clicked', async () => {
    const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
    const { getByTestId } = await renderProfile()

    const row = getByTestId('Conditions Générales d’Utilisation')
    fireEvent.click(row)

    expect(openUrl).toBeCalledWith(env.CGU_LINK)
  })
  it('should navigate when the data-privacy-chart row is clicked', async () => {
    const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
    const { getByTestId } = await renderProfile()

    const row = getByTestId('Charte de protection des données personnelles')
    fireEvent.click(row)

    expect(openUrl).toBeCalledWith(env.DATA_PRIVACY_CHART_LINK)
  })
  it('should redirect to ConfirmDeleteProfile page when the account-deletion row is clicked', async () => {
    const { getByTestId } = await renderProfile()

    const row = getByTestId('Suppression du compte')
    fireEvent.click(row)

    expect(navigate).toBeCalledWith('ConfirmDeleteProfile')
  })
})
