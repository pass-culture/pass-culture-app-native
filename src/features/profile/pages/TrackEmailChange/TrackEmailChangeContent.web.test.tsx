import React from 'react'
import { openInbox } from 'react-native-email-link'

import * as getEmailUpdateStep from 'features/profile/helpers/getEmailUpdateStep'
import { TrackEmailChangeContent } from 'features/profile/pages/TrackEmailChange/TrackEmailChangeContent'
import { fireEvent, render, screen } from 'tests/utils/web'

jest.mock('features/auth/context/AuthContext')

const getStepButtonStateSpy = jest.spyOn(getEmailUpdateStep, 'getEmailUpdateStep') as jest.Mock

describe('TrackEmailChangeContent', () => {
  it('should not open mail app when clicking first step and first step is active', () => {
    getStepButtonStateSpy.mockReturnValueOnce(0)
    render(<TrackEmailChangeContent />)

    fireEvent.click(screen.getByText('Confirme ta demande'))

    expect(openInbox).not.toHaveBeenCalledTimes(1)
  })

  it('should not open mail app when clicking last step and last step is active', () => {
    getStepButtonStateSpy.mockReturnValueOnce(2)
    render(<TrackEmailChangeContent />)

    fireEvent.click(screen.getByText('Valide ta nouvelle adresse'))

    expect(openInbox).not.toHaveBeenCalledTimes(1)
  })
})
