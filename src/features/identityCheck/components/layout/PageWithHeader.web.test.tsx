import React from 'react'
import { Text } from 'react-native'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { render } from 'tests/utils/web'

describe('<PageWithHeader/>', () => {
  it('should render correctly', () => {
    const { container } = render(
      <PageWithHeader
        title="Page with header title"
        scrollChildren={<Text>scroll children</Text>}
        fixedBottomChildren={<Text>fixed bottom children</Text>}
        onGoBack={mockGoBack}
      />
    )

    expect(container).toMatchSnapshot()
  })
})
