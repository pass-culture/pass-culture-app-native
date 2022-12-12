import React from 'react'

import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { FastEduconnectConnectionRequestModal } from './FastEduconnectConnectionRequestModal'

const mockDispatch = jest.fn()

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: mockDispatch,
    ...mockState,
  })),
}))
jest.mock('libs/firebase/firestore/ubbleETAMessage', () => ({
  useUbbleETAMessage: jest.fn(() => ({ data: 'Environ 3 heures' })),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')
useFeatureFlagSpy.mockReturnValue(false)

describe('<FastEduconnectConnectionRequestModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <FastEduconnectConnectionRequestModal visible hideModal={jest.fn()} />
      )
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
