import React from 'react'

import { render, screen } from 'tests/utils'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { Spacer, TypoDS } from 'ui/theme'

describe('accessibilityList', () => {
  it.each`
    itemList                                                                              | numberOfSeparator
    ${[]}                                                                                 | ${0}
    ${[<TypoDS.Body key={1}>Item</TypoDS.Body>]}                                          | ${0}
    ${[<TypoDS.Body key={1}>Item</TypoDS.Body>, <TypoDS.Body key={2}>Item</TypoDS.Body>]} | ${1}
  `(
    'should render $itemList.length items and $numberOfSeparator separators',
    ({ itemList, numberOfSeparator }) => {
      const Separator = <Spacer.Column numberOfSpaces={6} testID="accessibility-list-separator" />

      render(<AccessibleUnorderedList items={itemList} Separator={Separator} />)

      const separatorList = screen.queryAllByTestId('accessibility-list-separator')

      expect(screen.queryAllByText('Item')).toHaveLength(itemList.length)
      expect(separatorList).toHaveLength(numberOfSeparator)
    }
  )
})
