import React from 'react'

import { render, screen } from 'tests/utils'
import { FilterButtonList } from 'ui/components/FilterButtonList'

const items = [
  { label: 'Filter 1', onPress: jest.fn(), isApplied: false, testID: 'filter1' },
  { label: 'Filter 2', onPress: jest.fn(), isApplied: true, testID: 'filter2' },
]

describe('<FilterButtonList />', () => {
  it('should render a list of filter buttons', () => {
    render(<FilterButtonList items={items} />)

    expect(screen.getByText('Filter 1')).toBeOnTheScreen()
    expect(screen.getByText('Filter 2')).toBeOnTheScreen()
  })
})
