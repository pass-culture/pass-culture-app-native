import React from 'react'

import * as useGoBack from 'features/navigation/useGoBack'
import { render } from 'tests/utils/web'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'

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
        scrollChildren={<Typo.Body>scroll children</Typo.Body>}
        fixedBottomChildren={<Typo.Body>fixed bottom children</Typo.Body>}
        onGoBack={mockGoBack}
      />
    )

    expect(container).toMatchSnapshot()
  })
})
