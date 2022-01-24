import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { ReportOfferOtherReason } from 'features/offer/components/ReportOfferOtherReason'
import { QueryKeys } from 'libs/queryKeys'
import { fireEvent, render, useMutationFactory } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

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

describe('<ReportOfferOtherReason />', () => {
  describe('Report offer button', () => {
    const queryClient = useQueryClient()

    it('should enable the button when large input is filled', async () => {
      const { getByTestId } = renderReportOfferOtherReason()

      const reportButton = getByTestId('report-other-button')
      expect(reportButton.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)

      const largeTextInput = getByTestId('large-text-input')
      fireEvent.changeText(largeTextInput, 'Hello !')

      await waitForExpect(() => {
        expect(reportButton.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
      })
    })

    it('should show error snackbar on report offer mutation error', async () => {
      const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
        onSuccess: () => {},
        onError: () => {},
      }
      // @ts-expect-error ts(2345)
      mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))

      const { getByTestId } = renderReportOfferOtherReason()

      const reportButton = getByTestId('report-other-button')

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

      const { getByTestId } = renderReportOfferOtherReason()

      const reportButton = getByTestId('report-other-button')

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
