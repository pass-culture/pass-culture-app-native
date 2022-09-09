import React from 'react'

import {
  SearchFilterModal,
  SearchFilterModalProps,
} from 'features/search/components/SearchFilterModal'
import { render } from 'tests/utils/web'
import { Close } from 'ui/svg/icons/Close'

describe('SearchFilterModal component', () => {
  const props: SearchFilterModalProps = {
    visible: true,
    modalContentChildren: <React.Fragment />,
    fixedBottomChildren: <React.Fragment />,
    title: 'SearchFilter modal',
    leftIcon: undefined,
    onLeftIconPress: undefined,
    leftIconAccessibilityLabel: undefined,
    rightIcon: Close,
    onRightIconPress: jest.fn(),
    rightIconAccessibilityLabel: 'Accessibilité label',
  }

  it('should use the modal header without background in desktop view', () => {
    const { getByTestId } = render(<SearchFilterModal {...props} />, {
      theme: { isDesktopViewport: true },
    })

    const modalHeader = getByTestId('modalHeader')

    expect(modalHeader).toBeTruthy()
  })

  it('should use the modal header with background in mobile view', () => {
    const { getByTestId } = render(<SearchFilterModal {...props} />, {
      theme: { isDesktopViewport: false },
    })

    const pageHeader = getByTestId('pageHeader')

    expect(pageHeader).toBeTruthy()
  })
})
