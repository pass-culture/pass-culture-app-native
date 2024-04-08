import React from 'react'
import InAppReview from 'react-native-in-app-review'

import { useReviewInAppInformation } from 'features/bookOffer/helpers/useReviewInAppInformation'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { useShowReview } from 'libs/hooks/useShowReview'
import { render } from 'tests/utils/web'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

const mockRequestInAppReview = InAppReview.RequestInAppReview as jest.Mock

jest.mock('features/bookOffer/helpers/useReviewInAppInformation')
const mockUseReviewInAppInformation = useReviewInAppInformation as jest.Mock

const TestReviewComponent = () => {
  useShowReview()
  return null
}

describe('useShowReview', () => {
  it('should not show the review in web even if it should be requested in native', () => {
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })

    render(<TestReviewComponent />)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })
})
