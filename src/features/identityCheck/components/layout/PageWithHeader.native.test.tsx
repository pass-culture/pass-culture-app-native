import React from 'react'
import { Text, Platform } from 'react-native'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { render, screen } from 'tests/utils'

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
