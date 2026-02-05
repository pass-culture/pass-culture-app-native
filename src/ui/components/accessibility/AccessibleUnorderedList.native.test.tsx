import React from 'react'

import { render, screen } from 'tests/utils'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { Spacer, Typo } from 'ui/theme'

describe('accessibilityList', () => {
  it.each`
    itemList                                                                      | numberOfSeparator
    ${[]}                                                                         | ${0}
    ${[<Typo.Body key={1}>Item</Typo.Body>]}                                      | ${0}
    ${[<Typo.Body key={1}>Item</Typo.Body>, <Typo.Body key={2}>Item</Typo.Body>]} | ${1}
  `(
    'should render $itemList.length items and $numberOfSeparator separators',
    ({ itemList, numberOfSeparator }) => {
      const Separator = <Spacer.Column numberOfSpaces={6} testID="accessibility-list-separator" />

      render(<AccessibleUnorderedList items={itemList} Separator={Separator} withPadding />)

      const separatorList = screen.queryAllByTestId('accessibility-list-separator')

      expect(screen.queryAllByText('Item')).toHaveLength(itemList.length)
      expect(separatorList).toHaveLength(numberOfSeparator)
    }
  )
})
