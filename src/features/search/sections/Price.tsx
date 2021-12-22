import React from 'react'

import { CenteredSection, TitleWithCount } from 'features/search/atoms'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { formatPriceInEuroToDisplayPrice } from 'libs/parsers'
import { Range } from 'libs/typesUtils/typeHelpers'
import { Slider } from 'ui/components/inputs/Slider'

export const Price: React.FC = () => {
  const logUseFilter = useLogFilterOnce(SectionTitle.Price)
  const { searchState, dispatch } = useStagedSearch()

  const maxPrice = useMaxPrice()
  const priceRange = searchState.priceRange ?? [0, maxPrice]
  const count = +(priceRange[0] > 0 || priceRange[1] < maxPrice)
  const values = searchState.offerIsFree ? [0, 0] : priceRange

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
        max={maxPrice}
        formatValues={formatPriceInEuroToDisplayPrice}
        onValuesChangeFinish={onValuesChangeFinish}
      />
    </CenteredSection>
  )
}
