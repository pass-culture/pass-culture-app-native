import React from 'react'

import { AsyncErrorBoundary } from 'features/errors/pages/AsyncErrorBoundary'
import * as useGoBack from 'features/navigation/useGoBack'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { AsyncError, LogTypeEnum } from 'libs/monitoring/errors'
import { checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

jest.mock('libs/monitoring/services')

const resetErrorBoundary = jest.fn()

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('AsyncErrorBoundary component', () => {
  beforeEach(() => setFeatureFlags())

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={resetErrorBoundary} />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })

  it('should render correctly', () => {
    const { container } = render(
      <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={resetErrorBoundary} />
    )

    expect(container).toMatchSnapshot()
  })

  it('should have back arrow if possible', () => {
    render(
      <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={resetErrorBoundary} />
    )

    expect(screen.getByTestId('Revenir en arrière')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should call retry with AsyncError', async () => {
    const retry = jest.fn()
    render(
      <AsyncErrorBoundary
        error={new AsyncError('error', { retry, logType: LogTypeEnum.ERROR })}
        resetErrorBoundary={resetErrorBoundary}
      />
    )

    expect(retry).not.toHaveBeenCalled()

    const button = await screen.findByText('Réessayer')
    fireEvent.click(button)

    expect(retry).toHaveBeenCalledTimes(1)
  })
})
