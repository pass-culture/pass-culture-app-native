import React from 'react'

import { CenteredSection, TitleWithCount } from 'features/search/atoms'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { Range } from 'libs/typesUtils/typeHelpers'
import { Slider } from 'ui/components/inputs/Slider'

const formatEuro = (price: number) => `${price} €`

export const Price: React.FC = () => {
  const logUseFilter = useLogFilterOnce(SectionTitle.Price)
  const { searchState, dispatch } = useSearch()
  const values = searchState.priceRange ?? [0, MAX_PRICE]
  const count = +(values[0] > 0 || values[1] < MAX_PRICE)

  const onValuesChange = (newValues: number[]) => {
    dispatch({ type: 'PRICE_RANGE', payload: newValues as Range<number> })
    logUseFilter()
  }

  return (
    <CenteredSection title={<TitleWithCount title={SectionTitle.Price} count={count} />}>
      <Slider
        showValues={true}
        values={values}
        max={MAX_PRICE}
        formatValues={formatEuro}
        onValuesChange={onValuesChange}
      />
    </CenteredSection>
  )
}
