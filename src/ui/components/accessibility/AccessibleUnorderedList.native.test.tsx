import React from 'react'
import { View } from 'react-native'

import { render, screen } from 'tests/utils'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { Typo } from 'ui/theme'

describe('accessibilityList', () => {
  it.each`
    itemList                                                                      | numberOfSeparator
    ${[]}                                                                         | ${0}
    ${[<Typo.Body key={1}>Item</Typo.Body>]}                                      | ${0}
    ${[<Typo.Body key={1}>Item</Typo.Body>, <Typo.Body key={2}>Item</Typo.Body>]} | ${1}
  `(
    'should render $itemList.length items and $numberOfSeparator separators',
    ({ itemList, numberOfSeparator }) => {
      const Separator = <View testID="accessibility-list-separator" />

      render(<AccessibleUnorderedList items={itemList} Separator={Separator} withPadding />)

      const separatorList = screen.queryAllByTestId('accessibility-list-separator')

      expect(screen.queryAllByText('Item')).toHaveLength(itemList.length)
      expect(separatorList).toHaveLength(numberOfSeparator)
    }
  )
})
