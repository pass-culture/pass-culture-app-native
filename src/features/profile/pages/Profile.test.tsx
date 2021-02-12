import { render, act, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import * as NavigationHelpers from 'features/navigation/helpers'
import { flushAllPromises } from 'tests/utils'

import { Profile } from './Profile'

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
  const wrapper = render(<Profile />)
  await act(async () => {
    await flushAllPromises()
  })
  return wrapper
}

describe('Profile component', () => {
  beforeEach(navigate.mockRestore)

  it('should navigate when the personal data row is clicked', async () => {
    const { getByTestId } = await renderProfile()

    const row = getByTestId('row-personal-data')
    fireEvent.press(row)

    expect(navigate).toBeCalledWith('TemporaryProfilePage')
  })

  it('should navigate when the password row is clicked', async () => {
    const { getByTestId } = await renderProfile()

    const row = getByTestId('row-password')
    fireEvent.press(row)

    expect(navigate).toBeCalledWith('TemporaryProfilePage')
  })

  it('should navigate when the how-it-works row is clicked', async () => {
    const { getByTestId } = await renderProfile()

    const row = getByTestId('row-how-it-works')
    fireEvent.press(row)

    expect(navigate).toBeCalledWith('TemporaryProfilePage')
  })

  it('should navigate when the faq row is clicked', async () => {
    const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')
    const { getByTestId } = await renderProfile()

    const row = getByTestId('row-faq')
    fireEvent.press(row)

    expect(openExternalUrl).toBeCalledWith('https://aide.passculture.app/fr/')
  })

  it('should navigate when the accessibility row is clicked', async () => {
    const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')
    const { getByTestId } = await renderProfile()

    const row = getByTestId('row-accessibility')
    fireEvent.press(row)

    expect(openExternalUrl).toBeCalledWith('https://pass.culture.fr/accessibilite-de-la-webapp/')
  })

  it('should navigate when the legal notices row is clicked', async () => {
    const { getByTestId } = await renderProfile()

    const row = getByTestId('row-legal-notices')
    fireEvent.press(row)

    expect(navigate).toBeCalledWith('TemporaryProfilePage')
  })

  it('should navigate when the confidentiality row is clicked', async () => {
    const { getByTestId } = await renderProfile()

    const row = getByTestId('row-confidentiality')
    fireEvent.press(row)

    expect(navigate).toBeCalledWith('TemporaryProfilePage')
  })
})
