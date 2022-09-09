import React from 'react'

import {
  SearchFilterModal,
  SearchFilterModalProps,
} from 'features/search/components/SearchFilterModal'
import { render } from 'tests/utils'
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

  it('should render correctly', () => {
    expect(render(<SearchFilterModal {...props} />)).toMatchSnapshot()
  })
})
