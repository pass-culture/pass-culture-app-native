import React from 'react'
import InAppReview from 'react-native-in-app-review'

import { useReviewInAppInformation } from 'features/bookOffer/helpers/useReviewInAppInformation'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { useShowReview } from 'libs/hooks/useShowReview'
import { render } from 'tests/utils/web'

const mockRequestInAppReview = InAppReview.RequestInAppReview as jest.Mock

jest.mock('features/bookOffer/helpers/useReviewInAppInformation')
const mockUseReviewInAppInformation = useReviewInAppInformation as jest.Mock

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
const TestReviewComponent = () => {
  useShowReview()
  return null
}

describe('useShowReview', () => {
  it('should not show the review in web even if it should be requested in native', () => {
    setFeatureFlags()
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })

    render(<TestReviewComponent />)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })
})
