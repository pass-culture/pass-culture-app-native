import React from 'react'

import { useRoute, replace } from '__mocks__/@react-navigation/native'
import { UpdateEmailTokenExpiration } from 'api/gen'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
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

describe('<ChangeEmail/> - old version', () => {
  jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockServer.getApi<UpdateEmailTokenExpiration>('/v1/profile/token_expiration', {
        expiration: null,
      })
      const { container } = render(reactQueryProviderHOC(<ChangeEmail />))

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour l’email')).toHaveFocus()
      })

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })

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
    render(reactQueryProviderHOC(<ChangeEmail />))

    await screen.findByText('Modifier mon e-mail')

    const closeButton = screen.getByLabelText('Fermer la modale')
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(replace).toHaveBeenNthCalledWith(1, 'ChangeEmail', { showModal: false })
    })
  })
})
