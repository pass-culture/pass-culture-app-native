import React from 'react'

import { render, screen } from 'tests/utils'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { Spacer, Typo } from 'ui/theme'

describe('accessibilityList', () => {
  it.each`
    itemList                                                                      | numberOfSeparator
    ${[]}                                                                         | ${0}
    ${[<Typo.Body key={1}>Item</Typo.Body>]}                                      | ${0}
    ${[<Typo.Body key={1}>Item</Typo.Body>, <Typo.Body key={2}>Item</Typo.Body>]} | ${1}
  `(
    'it should render $itemList.length items and $numberOfSeparator separators',
    ({ itemList, numberOfSeparator }) => {
      const Separator = <Spacer.Column numberOfSpaces={6} testID="accessibility-list-separator" />

      render(<AccessibilityList items={itemList} Separator={Separator} />)

      const separatorList = screen.queryAllByTestId('accessibility-list-separator')

      expect(screen.queryAllByText('Item').length).toEqual(itemList.length)
      expect(separatorList.length).toEqual(numberOfSeparator)
    }
  )
})
