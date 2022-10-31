import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { ReportOfferReason } from 'features/offer/components/ReportOfferReason/ReportOfferReason'
import { QueryKeys } from 'libs/queryKeys'
import { fireEvent, render, useMutationFactory } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('react-query')

const mockedUseMutation = mocked(useMutation)
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

jest.mock('features/offer/services/useReasonsForReporting', () => ({
  useReasonsForReporting: jest.fn(() => ({
    data: {
      reasons: {
        IMPROPER: {
          description: 'La date ne correspond pas, mauvaise description...',
          title: 'La description est non conforme',
        },
        INAPPROPRIATE: {
          description: 'violence, incitation à la haine, nudité...',
          title: 'Le contenu est inapproprié',
        },
        OTHER: {
          description: '',
          title: 'Autre',
        },
        PRICE_TOO_HIGH: {
          description: "comparé à l'offre public",
          title: 'Le tarif est trop élevé',
        },
      },
    },
  })),
}))

describe('<ReportOfferReason />', () => {
  describe('Report offer button', () => {
    const queryClient = useQueryClient()

    it('should be disabled if no reason is selected', () => {
      const { getByTestId } = renderReportReason()
      const reportButton = getByTestId('report-button')
      expect(reportButton).toBeDisabled()
    })

    it('should be enabled if a reason is selected', () => {
      const renderAPI = renderReportReason()

      const radioButton = renderAPI.getByTestId('radio-button-INAPPROPRIATE')
      const reportButton = renderAPI.getByTestId('report-button')

      fireEvent.press(radioButton)

      expect(reportButton).toBeEnabled()
    })

    it('should show error snackbar on report offer mutation error', async () => {
      const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
        onSuccess: () => {},
        onError: () => {},
      }
      // @ts-expect-error ts(2345)
      mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))

      const { getByTestId } = renderReportReason()

      const reportButton = getByTestId('report-button')

      fireEvent.press(reportButton)

      useMutationCallbacks.onSuccess()
      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message: 'Ton signalement a bien été pris en compte',
        timeout: 5000,
      })
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith(QueryKeys.REPORTED_OFFERS)
    })

    it('should show error snackbar on report offer mutation error', async () => {
      const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
        onSuccess: () => {},
        onError: () => {},
      }
      // @ts-expect-error ts(2345)
      mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
      const response = {
        content: { code: 'ERROR', message: "Une erreur s'est produite" },
        name: 'ApiError',
      }

      const { getByTestId } = renderReportReason()

      const reportButton = getByTestId('report-button')

      fireEvent.press(reportButton)

      useMutationCallbacks.onError(response)
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: response.content.message,
        timeout: 5000,
      })
    })
  })
})

function renderReportReason() {
  return render(
    <ReportOfferReason
      dismissModal={mockDismissModal}
      onPressOtherReason={jest.fn}
      offerId={1234}
    />
  )
}
