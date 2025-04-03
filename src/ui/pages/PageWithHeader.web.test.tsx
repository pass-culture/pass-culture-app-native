import React from 'react'
import { Text } from 'react-native'

import * as useGoBack from 'features/navigation/useGoBack'
import { render } from 'tests/utils/web'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

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
