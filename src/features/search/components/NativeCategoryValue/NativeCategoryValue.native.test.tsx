import React from 'react'

import { NativeCategoryIdEnumv2 } from 'api/gen'
import { NativeCategoryValue } from 'features/search/components/NativeCategoryValue/NativeCategoryValue'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { render } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('<NativeCategoryValue />', () => {
  it('should render the native category value when data and nativeCategoryId are passed', () => {
    const nativeCategoryId = NativeCategoryIdEnumv2.MUSIQUE_EN_LIGNE

    const { getByText } = render(<NativeCategoryValue nativeCategoryId={nativeCategoryId} />)

    expect(getByText('Musique en ligne')).toBeTruthy()
  })

  it('should render anything when UNKNOW nativeCategoryId are passed', () => {
    const nativeCategoryId = 'UNKNOWN' as NativeCategoryIdEnumv2
    const { queryByTestId } = render(<NativeCategoryValue nativeCategoryId={nativeCategoryId} />)

    expect(queryByTestId('native-category-value')).toBeNull()
  })
})
