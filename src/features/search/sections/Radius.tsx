import React from 'react'

import { CenteredSection } from 'features/search/atoms'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { Slider } from 'ui/components/inputs/Slider'

const formatKm = (km: number) => `${km} km`

export const Radius: React.FC = () => {
  const logUseFilter = useLogFilterOnce(SectionTitle.Radius)
  const { searchState, dispatch } = useStagedSearch()
  const radius = searchState.aroundRadius ?? MAX_RADIUS

  const onValuesChangeFinish = (newValues: number[]) => {
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
        onValuesChangeFinish={onValuesChangeFinish}
      />
    </CenteredSection>
  )
}
