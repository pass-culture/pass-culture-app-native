import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { ReportOfferReasonModal } from 'features/offer/components/ReportOfferReasonModal'
import { QueryKeys } from 'libs/queryKeys'
import { fireEvent, render, useMutationFactory } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'
import { ColorsEnum } from 'ui/theme'

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

describe('<ReportOfferReasonModal />', () => {
  describe('Report offer button', () => {
    const queryClient = useQueryClient()

    it('should be disabled if no reason is selected', () => {
      const { getByTestId } = renderReportReasonModal()
      const reportButton = getByTestId('report-button')
      expect(reportButton.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
    })

    it('should be enabled if a reason is selected', () => {
      const { getByTestId } = renderReportReasonModal()
      const radioButton = getByTestId('radio-button-1')
      const reportButton = getByTestId('report-button')

      fireEvent.press(radioButton)

      expect(reportButton.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
    })

    it('should show error snackbar on report offer mutation error', async () => {
      const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
        onSuccess: () => {},
        onError: () => {},
      }
      // @ts-ignore ts(2345)
      mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))

      const { getByTestId } = renderReportReasonModal()

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
      // @ts-ignore ts(2345)
      mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
      const response = {
        content: { code: 'ERROR', message: "Une erreur s'est produite" },
        name: 'ApiError',
      }

      const { getByTestId } = renderReportReasonModal()

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

function renderReportReasonModal() {
  return render(
    <ReportOfferReasonModal
      isVisible
      dismissModal={mockDismissModal}
      onGoBack={jest.fn}
      onPressOtherReason={jest.fn}
      offerId={1234}
    />
  )
}
