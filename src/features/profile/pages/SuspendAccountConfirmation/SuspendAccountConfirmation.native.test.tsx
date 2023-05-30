import React from 'react'

import { EmailHistoryEventTypeEnum } from 'api/gen'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { SuspendAccountConfirmation } from 'features/profile/pages/SuspendAccountConfirmation/SuspendAccountConfirmation'
import { fireEvent, render, screen } from 'tests/utils'

const useEmailUpdateStatusSpy = jest
  .spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus')
  .mockReturnValue({
    data: {
      expired: false,
      newEmail: '',
      status: EmailHistoryEventTypeEnum.CANCELLATION,
    },
  })

jest.mock('features/navigation/navigationRef')

describe('<SuspendAccountConfirmation />', () => {
  describe('should navigate to home', () => {
    it('When there is not current email change', () => {
      useEmailUpdateStatusSpy.mockReturnValueOnce({
        data: undefined,
      })
      render(<SuspendAccountConfirmation />)
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })

    it('When last email change expired', () => {
      useEmailUpdateStatusSpy.mockReturnValueOnce({
        data: {
          expired: true,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
        },
      })
      render(<SuspendAccountConfirmation />)
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })

    it('When pressing "Ne pas suspendre mon compte" button', () => {
      useEmailUpdateStatusSpy.mockReturnValueOnce({
        data: {
          expired: false,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
        },
      })
      render(<SuspendAccountConfirmation />)

      fireEvent.press(screen.getByText('Ne pas suspendre mon compte'))

      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })
  })

  it('should display message and buttons when there is current email change', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: '',
        status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      },
    })
    render(<SuspendAccountConfirmation />)
    expect(screen.getByText('Souhaites-tu suspendre ton compte pass Culture ?')).toBeTruthy()
    expect(screen.getByText('Oui, suspendre mon compte')).toBeTruthy()
    expect(screen.getByText('Ne pas suspendre mon compte')).toBeTruthy()
  })
})
