import React from 'react'
import { Text, Platform } from 'react-native'

import * as useGoBack from 'features/navigation/useGoBack'
import { render, screen } from 'tests/utils'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<PageWithHeader/>', () => {
  it('should render correctly', () => {
    Platform.OS = 'ios'

    render(
      <PageWithHeader
        title="Page with header title"
        scrollChildren={<Text>scroll children</Text>}
        fixedBottomChildren={<Text>fixed bottom children</Text>}
        onGoBack={mockGoBack}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly on Android, with white header', () => {
    Platform.OS = 'android'

    render(
      <PageWithHeader
        title="Page with header title"
        scrollChildren={<Text>scroll children</Text>}
        fixedBottomChildren={<Text>fixed bottom children</Text>}
        onGoBack={mockGoBack}
      />
    )

    expect(screen).toMatchSnapshot()
  })
})
