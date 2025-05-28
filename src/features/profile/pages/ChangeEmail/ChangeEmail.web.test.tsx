import React from 'react'

import { useRoute, replace } from '__mocks__/@react-navigation/native'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen, waitFor, fireEvent } from 'tests/utils/web'

import { ChangeEmail } from './ChangeEmail'

// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<ChangeEmail/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<ChangeEmail />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })

  describe('DeleteProfileReasonNewEmailModal', () => {
    it('should hide DeleteProfileReasonNewEmailModal when clicking on "Fermer la modale"', async () => {
      useRoute.mockReturnValueOnce({ params: { showModal: true } })
      render(reactQueryProviderHOC(<ChangeEmail />))

      const closeButton = screen.getByLabelText('Fermer la modale')
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Modifie ton adresse e-mail sur ce compte')).not.toBeOnTheScreen()
      })
    })

    it('should update the URL params when the modal is closed', async () => {
      useRoute.mockReturnValueOnce({ params: { showModal: true } })

      await act(async () => {
        render(reactQueryProviderHOC(<ChangeEmail />))
      })

      const modifyEmailText = await screen.findByText('Modifier mon e-mail')

      expect(modifyEmailText).toBeInTheDocument()

      const closeButton = await screen.findByLabelText('Fermer la modale')
      await act(async () => {
        fireEvent.click(closeButton)
      })

      await waitFor(() => {
        expect(replace).toHaveBeenCalledTimes(1)
        expect(replace).toHaveBeenCalledWith('ProfileStackNavigator', {
          params: {
            showModal: false,
          },
          screen: 'ChangeEmail',
        })
      })
    })
  })
})
