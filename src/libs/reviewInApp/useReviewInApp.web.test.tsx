import React, { useEffect } from 'react'
import InAppReview from 'react-native-in-app-review'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { useReviewInApp } from 'libs/reviewInApp/useReviewInApp'
import { render } from 'tests/utils/web'

const mockRequestInAppReview = InAppReview.RequestInAppReview as jest.Mock

const TestComponent = () => {
  const { requestReview } = useReviewInApp()
  useEffect(() => {
    void requestReview('booking_success', { delayMs: 0 })
  }, [requestReview])
  return null
}

describe('useReviewInApp (web)', () => {
  it('does not trigger the native review prompt on web', () => {
    setFeatureFlags()

    render(<TestComponent />)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })
})
