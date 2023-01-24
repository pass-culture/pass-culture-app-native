import React from 'react'

import { NativeCategoryIdEnumv2, SubcategoriesResponseModelv2 } from 'api/gen'
import { NativeCategoryValue } from 'features/search/components/NativeCategoryValue/NativeCategoryValue'
import { render } from 'tests/utils'

describe('<NativeCategoryValue />', () => {
  it('should render the native category value when data and nativeCategoryId are passed', () => {
    const data = {
      nativeCategories: [
        { genreType: 'MUSIC', name: 'CD_VINYLES', value: 'CD, vinyles' },
        { genreType: 'MUSIC', name: 'MUSIQUE_EN_LIGNE', value: 'Musique en ligne' },
      ],
    } as SubcategoriesResponseModelv2
    const nativeCategoryId = NativeCategoryIdEnumv2.MUSIQUE_EN_LIGNE

    const { getByText } = render(
      <NativeCategoryValue data={data} nativeCategoryId={nativeCategoryId} />
    )

    expect(getByText('Musique en ligne')).toBeTruthy()
  })

  it('should not render anything when no data are passed', () => {
    const nativeCategoryId = NativeCategoryIdEnumv2.MUSIQUE_EN_LIGNE
    const { queryByTestId } = render(
      <NativeCategoryValue data={undefined} nativeCategoryId={nativeCategoryId} />
    )

    expect(queryByTestId('native-category-value')).toBeNull()
  })
})
