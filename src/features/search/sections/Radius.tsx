import React from 'react'

import { CenteredSection } from 'features/search/atoms'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { Slider } from 'ui/components/inputs/Slider'

const formatKm = (km: number) => `${km} km`

export const Radius: React.FC = () => {
  const logUseFilter = useLogFilterOnce(SectionTitle.Radius)
  const { searchState, dispatch } = useSearch()
  const radius = searchState.aroundRadius ?? MAX_RADIUS

  const onValuesChange = (newValues: number[]) => {
    dispatch({ type: 'RADIUS', payload: newValues[0] })
    logUseFilter()
  }

  return (
    <CenteredSection title={SectionTitle.Radius}>
      <Slider
        showValues={true}
        values={[radius]}
        max={MAX_RADIUS}
        formatValues={formatKm}
        onValuesChange={onValuesChange}
      />
    </CenteredSection>
  )
}
