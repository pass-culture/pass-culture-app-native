import { act, render, waitFor } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises } from 'tests/utils'

import { PersonalData } from './PersonalData'

allowConsole({ error: true })

const mockedUseAuthContext = useAuthContext as jest.Mock

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const mockedIdentity: Partial<UserProfileResponse> = {
  firstName: 'Rosa',
  lastName: 'Bonheur',
  email: 'rosa.bonheur@gmail.com',
  phoneNumber: '+33685974563',
}

describe('PersonalData', () => {
  afterEach(() => jest.clearAllMocks())

  it('should render for beneficiary profile', async () => {
    const { getByText } = await renderPersonalData({
      isBeneficiary: true,
      ...mockedIdentity,
    } as UserProfileResponse)
    await waitFor(() => {
      expect(getByText('Prénom et nom')).toBeTruthy()
      expect(getByText('Rosa Bonheur')).toBeTruthy()
      expect(getByText('E-mail')).toBeTruthy()
      expect(getByText('rosa.bonheur@gmail.com')).toBeTruthy()
      expect(getByText('Numéro de téléphone')).toBeTruthy()
      expect(getByText('+33685974563')).toBeTruthy()
    })
  })
  it('should render for non beneficiary profile', async () => {
    const { getByText, queryByText } = await renderPersonalData({
      isBeneficiary: false,
      ...mockedIdentity,
    } as UserProfileResponse)

    await waitFor(() => {
      expect(getByText('E-mail')).toBeTruthy()
    })

    const name = queryByText('Prénom et nom')
    const phone = queryByText('Numéro de téléphone')

    expect(name).toBeNull()
    expect(phone).toBeNull()
  })
})

async function renderPersonalData(response: UserProfileResponse) {
  // mock connection state
  mockedUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn: true }))

  // mock api response based on the given parameters
  mockMeApiCall(response)
  const wrapper = render(reactQueryProviderHOC(<PersonalData />))
  await act(async () => {
    await flushAllPromises()
  })
  return wrapper
}

function mockMeApiCall(response: UserProfileResponse) {
  server.use(
    rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(response))
    })
  )
}
