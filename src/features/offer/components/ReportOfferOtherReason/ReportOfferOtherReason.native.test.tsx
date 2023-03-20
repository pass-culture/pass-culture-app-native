import React from 'react'
import { useMutation, useQueryClient } from 'react-query'

import { ReportOfferOtherReason } from 'features/offer/components/ReportOfferOtherReason/ReportOfferOtherReason'
import { QueryKeys } from 'libs/queryKeys'
import { fireEvent, render, screen, waitFor, useMutationFactory } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('react-query')

const mockedUseMutation = jest.mocked(useMutation)
const mockDismissModal = jest.fn()

const mockShowErrorSnackBar = jest.fn()
const mockShowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

describe('<ReportOfferOtherReason />', () => {
  describe('Report offer button', () => {
    const queryClient = useQueryClient()

    it('should enable the button when large input is filled', async () => {
      renderReportOfferOtherReason()

      const reportButton = screen.getByTestId('Signaler l’offre')
      expect(reportButton).toBeDisabled()

      const largeTextInput = screen.getByTestId('large-text-input')
      fireEvent.changeText(largeTextInput, 'Hello !')

      await waitFor(() => {
        expect(reportButton).toBeEnabled()
      })
    })

    it('should show success snackbar on report offer mutation success', () => {
      const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
        onSuccess: () => {},
        onError: () => {},
      }
      // @ts-expect-error ts(2345)
      mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
      renderReportOfferOtherReason()

      const reportButton = screen.getByTestId('Signaler l’offre')
      fireEvent.press(reportButton)

      useMutationCallbacks.onSuccess()
      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message: 'Ton signalement a bien été pris en compte',
        timeout: 5000,
      })
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith(QueryKeys.REPORTED_OFFERS)
    })

    it('should show error snackbar on report offer mutation error', () => {
      const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
        onSuccess: () => {},
        onError: () => {},
      }
      // @ts-expect-error ts(2345)
      mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
      const response = {
        content: { code: 'ERROR', message: 'Une erreur s’est produite' },
        name: 'ApiError',
      }
      renderReportOfferOtherReason()

      const reportButton = screen.getByTestId('Signaler l’offre')
      fireEvent.press(reportButton)

      useMutationCallbacks.onError(response)
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: response.content.message,
        timeout: 5000,
      })
    })
  })
})

function renderReportOfferOtherReason() {
  return render(<ReportOfferOtherReason dismissModal={mockDismissModal} offerId={1234} />)
}
