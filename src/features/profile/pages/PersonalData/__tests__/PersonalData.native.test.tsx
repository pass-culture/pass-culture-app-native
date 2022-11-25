import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct, render, fireEvent } from 'tests/utils'

import { PersonalData } from '../PersonalData'

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
  it('should render personal data success', async () => {
    const renderedPersonalData = await renderPersonalData({
      isBeneficiary: true,
      ...mockedIdentity,
    } as UserProfileResponse)
    expect(renderedPersonalData.toJSON()).toMatchSnapshot()
  })

  it('should render for beneficiary profile', async () => {
    const { getByText } = await renderPersonalData({
      isBeneficiary: true,
      ...mockedIdentity,
    } as UserProfileResponse)

    await waitForExpect(() => {
      expect(getByText('Prénom et nom')).toBeTruthy()
      expect(getByText('Rosa Bonheur')).toBeTruthy()
      expect(getByText('Adresse e-mail')).toBeTruthy()
      expect(getByText('rosa.bonheur@gmail.com')).toBeTruthy()
      expect(getByText('Numéro de téléphone')).toBeTruthy()
      expect(getByText('+33685974563')).toBeTruthy()
      expect(getByText('Mot de passe')).toBeTruthy()
      expect(getByText('*'.repeat(12))).toBeTruthy()
      expect(getByText('Supprimer mon compte')).toBeTruthy()
    })
  })

  it('should render for non beneficiary profile', async () => {
    const { queryByText } = await renderPersonalData({
      isBeneficiary: false,
      ...mockedIdentity,
    } as UserProfileResponse)

    await waitForExpect(() => {
      expect(queryByText('Adresse e-mail')).toBeTruthy()
      expect(queryByText('Mot de passe')).toBeTruthy()
      expect(queryByText('Supprimer mon compte')).toBeTruthy()
      expect(queryByText('Prénom et nom')).toBeNull()
      expect(queryByText('Numéro de téléphone')).toBeNull()
    })
  })

  it('should redirect to ChangeEmail when clicking on modify email button', async () => {
    const { getByTestId } = await renderPersonalData({
      isBeneficiary: false,
      ...mockedIdentity,
    } as UserProfileResponse)

    const modifyButton = getByTestId('Modifier e-mail')
    fireEvent.press(modifyButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('ChangeEmail', undefined)
      expect(analytics.logModifyMail).toHaveBeenCalledTimes(1)
    })
  })

  it('should redirect to ChangePassword when clicking on modify password button', async () => {
    const { getByTestId } = await renderPersonalData({
      isBeneficiary: false,
      ...mockedIdentity,
    } as UserProfileResponse)

    const modifyButton = getByTestId('Modifier mot de passe')
    fireEvent.press(modifyButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('ChangePassword', undefined)
    })
  })

  it('should log analytics and redirect to ConfirmDeleteProfile page when the account-deletion row is clicked', async () => {
    const { getByText } = await renderPersonalData({
      isBeneficiary: false,
      ...mockedIdentity,
    } as UserProfileResponse)

    const row = getByText('Supprimer mon compte')
    fireEvent.press(row)

    await waitForExpect(() => {
      expect(analytics.logAccountDeletion).toHaveBeenCalledTimes(1)
      expect(navigate).toBeCalledWith('ConfirmDeleteProfile', undefined)
    })
  })
})

async function renderPersonalData(response: UserProfileResponse) {
  // mock connection state
  mockedUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn: true }))

  // mock api response based on the given parameters
  mockMeApiCall(response)
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  const wrapper = render(reactQueryProviderHOC(<PersonalData />))
  await superFlushWithAct()
  return wrapper
}

function mockMeApiCall(response: UserProfileResponse) {
  server.use(
    rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(response))
    })
  )
}
