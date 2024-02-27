import React from 'react'
import { openInbox } from 'react-native-email-link'

import { navigate } from '__mocks__/@react-navigation/native'
import * as getEmailUpdateStep from 'features/profile/helpers/getEmailUpdateStep'
import { TrackEmailChangeContent } from 'features/profile/pages/TrackEmailChange/TrackEmailChangeContent'
import { nonBeneficiaryUser } from 'fixtures/user'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')

const getStepButtonStateSpy = jest.spyOn(getEmailUpdateStep, 'getEmailUpdateStep') as jest.Mock

describe('TrackEmailChangeContent', () => {
  it('should display default title when step is not active', () => {
    getStepButtonStateSpy.mockReturnValueOnce(-1)
    render(<TrackEmailChangeContent />)

    expect(screen.getByText('Confirmation de ta demande')).toBeOnTheScreen()
    expect(screen.getByText('Choix de ta nouvelle adresse e-mail')).toBeOnTheScreen()
    expect(screen.getByText('Validation de ta nouvelle adresse e-mail')).toBeOnTheScreen()
  })

  it.each`
    currentStep | expectedTitle
    ${0}        | ${'Confirme ta demande'}
    ${1}        | ${'Choisis ta nouvelle adresse e-mail'}
    ${2}        | ${'Valide ta nouvelle adresse'}
  `('should render correct title when step is active', async ({ currentStep, expectedTitle }) => {
    getStepButtonStateSpy.mockReturnValueOnce(currentStep)
    render(<TrackEmailChangeContent />)

    expect(screen.getByText(expectedTitle)).toBeOnTheScreen()
  })

  it('should not display subtitle when step is not active', () => {
    getStepButtonStateSpy.mockReturnValueOnce(-1)
    render(<TrackEmailChangeContent />)

    expect(
      screen.queryByText(`Depuis l’email envoyé à "${nonBeneficiaryUser.email}"`)
    ).not.toBeOnTheScreen()
    expect(screen.queryByText('Renseigne ta nouvelle adresse e-mail')).not.toBeOnTheScreen()
    expect(screen.queryByText('Depuis l’email envoyé à ""')).not.toBeOnTheScreen()
  })

  it.each`
    currentStep | expectedSubtitle
    ${0}        | ${`Depuis l’email envoyé à "${nonBeneficiaryUser.email}"`}
    ${1}        | ${'Renseigne ta nouvelle adresse e-mail'}
    ${2}        | ${'Depuis l’email envoyé à ""'}
  `('should render subtitle when step is active', async ({ currentStep, expectedSubtitle }) => {
    getStepButtonStateSpy.mockReturnValueOnce(currentStep)
    render(<TrackEmailChangeContent />)

    expect(screen.getByText(expectedSubtitle)).toBeOnTheScreen()
  })

  it('should open mail app when pressing first step and first step is active', () => {
    getStepButtonStateSpy.mockReturnValueOnce(0)
    render(<TrackEmailChangeContent />)

    fireEvent.press(screen.getByText('Confirme ta demande'))

    expect(openInbox).toHaveBeenCalledTimes(1)
  })

  it('should navigate to TrackEmailChange when pressing second step and second step is active', () => {
    getStepButtonStateSpy.mockReturnValueOnce(1)
    render(<TrackEmailChangeContent />)

    fireEvent.press(screen.getByText('Choisis ta nouvelle adresse e-mail'))

    expect(navigate).toHaveBeenCalledWith('TrackEmailChange', undefined)
  })

  it('should open mail app when pressing last step and last step is active', () => {
    getStepButtonStateSpy.mockReturnValueOnce(2)
    render(<TrackEmailChangeContent />)

    fireEvent.press(screen.getByText('Valide ta nouvelle adresse'))

    expect(openInbox).toHaveBeenCalledTimes(1)
  })
})
