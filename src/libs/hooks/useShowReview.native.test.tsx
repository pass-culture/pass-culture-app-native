import React, { useState } from 'react'
import { AppState, Button, Text } from 'react-native'
import InAppReview from 'react-native-in-app-review'

import { useReviewInAppInformation } from 'features/bookOffer/helpers/useReviewInAppInformation'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useShowReview } from 'libs/hooks/useShowReview'
import { render, renderHook, waitFor, userEvent, screen } from 'tests/utils'

jest.unmock('libs/appState')
const appStateSpy = jest.spyOn(AppState, 'addEventListener')

jest.mock('react-native-in-app-review')
const mockIsAvailable = InAppReview.isAvailable as jest.Mock
const mockRequestInAppReview = InAppReview.RequestInAppReview as jest.Mock

jest.mock('features/bookOffer/helpers/useReviewInAppInformation')
const mockUseReviewInAppInformation = useReviewInAppInformation as jest.Mock

const mockUpdateInformationWhenReviewHasBeenRequested = jest.fn()

jest.useFakeTimers()

const CompA = ({ onPress }) => {
  useShowReview()
  return (
    <React.Fragment>
      <Button onPress={onPress} title="press" />
      <Text>State A</Text>
    </React.Fragment>
  )
}

const CompB = () => {
  return <Text>State B</Text>
}

const Comp = () => {
  const [toggle, setToggle] = useState(true)

  return toggle ? (
    <CompA
      onPress={() => {
        setToggle(false)
      }}
    />
  ) : (
    <CompB />
  )
}

describe('useShowReview', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should show the review when it is available and we want to show it', () => {
    mockIsAvailable.mockReturnValueOnce(true)
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })
    mockRequestInAppReview.mockResolvedValueOnce(undefined)

    renderHook(useShowReview)

    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
  })

  it('should not show the review when it is not available', () => {
    mockIsAvailable.mockReturnValueOnce(false)
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })

    renderHook(useShowReview)

    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })

  it('should not show the review when we dont want to show it', () => {
    mockIsAvailable.mockReturnValueOnce(true)
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: false })

    renderHook(useShowReview)

    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })

  it('should update information if the review ends successfully', async () => {
    mockIsAvailable.mockReturnValueOnce(true)
    mockUseReviewInAppInformation.mockReturnValueOnce({
      shouldReviewBeRequested: true,
      updateInformationWhenReviewHasBeenRequested: mockUpdateInformationWhenReviewHasBeenRequested,
    })
    mockRequestInAppReview.mockResolvedValueOnce(true)

    renderHook(useShowReview)

    jest.advanceTimersByTime(3000)

    await waitFor(() => {
      expect(mockUpdateInformationWhenReviewHasBeenRequested).toHaveBeenCalledTimes(1)
    })
  })

  it('should not update information if the review does not end successfully', async () => {
    mockIsAvailable.mockReturnValueOnce(true)
    mockUseReviewInAppInformation.mockReturnValueOnce({
      shouldReviewBeRequested: true,
      updateInformationWhenReviewHasBeenRequested: mockUpdateInformationWhenReviewHasBeenRequested,
    })
    mockRequestInAppReview.mockResolvedValueOnce(false)

    renderHook(useShowReview)

    jest.advanceTimersByTime(3000)

    expect(mockUpdateInformationWhenReviewHasBeenRequested).not.toHaveBeenCalled()
  })

  it('should not call the review if something is wrong before timeout', async () => {
    const user = userEvent.setup()
    mockIsAvailable.mockReturnValueOnce(true)
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })
    mockRequestInAppReview.mockResolvedValueOnce(undefined)

    render(<Comp />)

    expect(screen.getByText('State A')).toBeVisible()
    expect(mockRequestInAppReview).not.toHaveBeenCalled()

    await user.press(screen.getByText('press'))

    expect(screen.getByText('State B')).toBeVisible()

    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })

  it('should call the review if nothing is wrong before timeout', async () => {
    mockIsAvailable.mockReturnValueOnce(true)
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })
    mockRequestInAppReview.mockResolvedValueOnce(undefined)

    render(<Comp />)

    expect(screen.getByText('State A')).toBeVisible()
    expect(mockRequestInAppReview).not.toHaveBeenCalled()

    jest.advanceTimersByTime(3000)

    expect(screen.getByText('State A')).toBeVisible()
    expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
  })

  describe('FF disableStoreReview', () => {
    beforeEach(() => {
      mockIsAvailable.mockReturnValueOnce(true)
      mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })
      mockRequestInAppReview.mockResolvedValueOnce(undefined)
    })

    it('should show the review when we enable store review', () => {
      setFeatureFlags()

      renderHook(useShowReview)

      jest.advanceTimersByTime(3000)

      expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
    })

    it('should not show the review when app is running in the background', () => {
      setFeatureFlags()

      renderHook(useShowReview)

      // @ts-expect-error: because of noUncheckedIndexedAccess
      const mockCurrentAppState = appStateSpy.mock.calls[0][1]
      mockCurrentAppState('active')
      mockCurrentAppState('background')
      jest.advanceTimersByTime(3000)

      expect(mockRequestInAppReview).not.toHaveBeenCalled()
    })

    it('should not show review when we disable store review', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW])

      renderHook(useShowReview)

      jest.advanceTimersByTime(3000)

      expect(mockRequestInAppReview).not.toHaveBeenCalled()
    })
  })
})
