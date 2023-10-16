import React from 'react'

import { NativeCategoryIdEnumv2 } from 'api/gen'
import { NativeCategoryValue } from 'features/search/components/NativeCategoryValue/NativeCategoryValue'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { render, screen } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('<NativeCategoryValue />', () => {
  it('should render the native category value when data and nativeCategoryId are passed', () => {
    const nativeCategoryId = NativeCategoryIdEnumv2.MUSIQUE_EN_LIGNE

    render(<NativeCategoryValue nativeCategoryId={nativeCategoryId} />)

    expect(screen.getByText('Musique en ligne')).toBeOnTheScreen()
  })

  it('should render anything when UNKNOW nativeCategoryId are passed', () => {
    const nativeCategoryId = 'UNKNOWN' as NativeCategoryIdEnumv2
    render(<NativeCategoryValue nativeCategoryId={nativeCategoryId} />)

    expect(screen.queryByTestId('native-category-value')).not.toBeOnTheScreen()
  })
})
