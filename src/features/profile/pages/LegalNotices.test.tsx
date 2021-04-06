import React from 'react'
import { UseQueryResult } from 'react-query'

import { UserProfileResponse } from 'api/gen'
import { contactSupport } from 'features/auth/support.services'
import * as NavigationHelpers from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { flushAllPromises, render, act, fireEvent } from 'tests/utils'

import { LegalNotices } from './LegalNotices'

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
  it('should navigate when the cgu row is clicked', async () => {
    const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')
    const { getByTestId } = await renderProfile()

    const row = getByTestId('row-cgu')
    fireEvent.press(row)

    expect(openExternalUrl).toBeCalledWith(env.CGU_LINK)
  })
  it('should navigate when the data-privacy-chart row is clicked', async () => {
    const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')
    const { getByTestId } = await renderProfile()

    const row = getByTestId('row-data-privacy-chart')
    fireEvent.press(row)

    expect(openExternalUrl).toBeCalledWith(env.DATA_PRIVACY_CHART_LINK)
  })
  it('should open email interface when the account-deletion row is clicked', async () => {
    const { getByTestId } = await renderProfile()

    const row = getByTestId('row-account-deletion')
    fireEvent.press(row)

    expect(contactSupport.forAccountDeletion).toBeCalledWith('email2@domain.ext')
  })
})
