import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import * as OpenUrlAPI from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment/__mocks__/envFixtures'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent, screen, waitFor } from 'tests/utils'

import { PersonalData } from './PersonalData'

const mockedUseAuthContext = jest.spyOn(Auth, 'useAuthContext')
const openUrl = jest.spyOn(OpenUrlAPI, 'openUrl')

const mockedIdentity: Partial<UserProfileResponse> = {
  firstName: 'Rosa',
  lastName: 'Bonheur',
  email: 'rosa.bonheur@gmail.com',
  phoneNumber: '+33685974563',
}

describe('PersonalData', () => {
  it('should render personal data success', () => {
    renderPersonalData({
      ...mockedIdentity,
      isBeneficiary: true,
    } as UserProfileResponse)

    expect(screen).toMatchSnapshot()
  })

  it('should render for beneficiary profile', () => {
    renderPersonalData({
      ...mockedIdentity,
      isBeneficiary: true,
    } as UserProfileResponse)

    expect(screen.queryByText('Prénom et nom')).toBeTruthy()
    expect(screen.queryByText('Rosa Bonheur')).toBeTruthy()
    expect(screen.queryByText('Adresse e-mail')).toBeTruthy()
    expect(screen.queryByText('rosa.bonheur@gmail.com')).toBeTruthy()
    expect(screen.queryByText('Numéro de téléphone')).toBeTruthy()
    expect(screen.queryByText('+33685974563')).toBeTruthy()
    expect(screen.queryByText('Mot de passe')).toBeTruthy()
    expect(screen.queryByText('*'.repeat(12))).toBeTruthy()
    expect(screen.queryByText('Supprimer mon compte')).toBeTruthy()
  })

  it('should render for beneficiary profile without phone number', () => {
    renderPersonalData({
      ...mockedIdentity,
      isBeneficiary: true,
      phoneNumber: null,
    } as UserProfileResponse)

    expect(screen.queryByText('Prénom et nom')).toBeTruthy()
    expect(screen.queryByText('Rosa Bonheur')).toBeTruthy()
    expect(screen.queryByText('Adresse e-mail')).toBeTruthy()
    expect(screen.queryByText('rosa.bonheur@gmail.com')).toBeTruthy()
    expect(screen.queryByText('Numéro de téléphone')).toBeNull()
    expect(screen.queryByText('Mot de passe')).toBeTruthy()
    expect(screen.queryByText('*'.repeat(12))).toBeTruthy()
    expect(screen.queryByText('Supprimer mon compte')).toBeTruthy()
  })

  it('should render for non beneficiary profile', () => {
    renderPersonalData({
      ...mockedIdentity,
      isBeneficiary: false,
    } as UserProfileResponse)

    expect(screen.queryByText('Prénom et nom')).toBeNull()
    expect(screen.queryByText('Adresse e-mail')).toBeTruthy()
    expect(screen.queryByText('Mot de passe')).toBeTruthy()
    expect(screen.queryByText('Numéro de téléphone')).toBeNull()
    expect(screen.queryByText('Supprimer mon compte')).toBeTruthy()
  })

  it('should redirect to ChangePassword when clicking on modify password button', () => {
    renderPersonalData({
      ...mockedIdentity,
      isBeneficiary: false,
    } as UserProfileResponse)

    const modifyButton = screen.getByTestId('Modifier mot de passe')
    fireEvent.press(modifyButton)

    expect(navigate).toBeCalledWith('ChangePassword', undefined)
  })

  it('should log analytics and redirect to ConfirmDeleteProfile page when the account-deletion row is clicked', async () => {
    renderPersonalData({
      ...mockedIdentity,
      isBeneficiary: false,
    } as UserProfileResponse)

    const deleteButton = screen.getByText('Supprimer mon compte')
    fireEvent.press(deleteButton)

    await waitFor(() => {
      expect(analytics.logAccountDeletion).toHaveBeenCalledTimes(1)
      expect(navigate).toBeCalledWith('ConfirmDeleteProfile', undefined)
    })
  })

  it('should open FAQ link when clicking on "Comment gérer tes données personnelles ?" button', () => {
    renderPersonalData({
      ...mockedIdentity,
      isBeneficiary: false,
    } as UserProfileResponse)

    const faqLink = screen.getByText('Comment gérer tes données personnelles ?')
    fireEvent.press(faqLink)

    expect(openUrl).toHaveBeenNthCalledWith(1, env.FAQ_LINK_PERSONAL_DATA, undefined, true)
  })
})

function renderPersonalData(response: UserProfileResponse) {
  mockedUseAuthContext.mockReturnValueOnce({
    setIsLoggedIn: jest.fn(),
    isLoggedIn: true,
    user: response,
    isUserLoading: false,
    refetchUser: jest.fn(),
  })

  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<PersonalData />))
}
