import React from 'react'

import { CenteredSection, TitleWithCount } from 'features/search/atoms'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { Range } from 'libs/typesUtils/typeHelpers'
import { Slider } from 'ui/components/inputs/Slider'

const formatEuro = (price: number) => `${price} €`

export const Price: React.FC = () => {
  const logUseFilter = useLogFilterOnce(SectionTitle.Price)
  const { searchState, dispatch } = useStagedSearch()
  const priceRange = searchState.priceRange ?? [0, MAX_PRICE]
  const values = searchState.offerIsFree ? [0, 0] : priceRange
  const count = +(values[0] > 0 || values[1] < MAX_PRICE)

  const onValuesChangeFinish = (newValues: number[]) => {
    const priceRangeIsFree = newValues[0] === 0 && newValues[1] === 0
    if (priceRangeIsFree && !searchState.offerIsFree) dispatch({ type: 'TOGGLE_OFFER_FREE' })
    if (!priceRangeIsFree && searchState.offerIsFree) dispatch({ type: 'TOGGLE_OFFER_FREE' })
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
        onValuesChangeFinish={onValuesChangeFinish}
      />
    </CenteredSection>
  )
}
