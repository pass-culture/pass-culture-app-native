import React from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useGetFullscreenModalSliderLength } from 'features/search/helpers/useGetFullscreenModalSliderLength'
import { Slider } from 'ui/components/inputs/Slider'
import { Spacer, Typo } from 'ui/theme'

const MIN_RADIUS = 0
const MAX_RADIUS = 100

interface LocationSearchFiltersProps {
  onValuesChange: (newValues: number[]) => void
  aroundRadius: number
}

export const LocationSearchFilters = ({
  onValuesChange,
  aroundRadius,
}: LocationSearchFiltersProps) => {
  const radiusLabelId = uuidv4()

  const formatKm = (km: number) => `${km}\u00a0km`
  const { sliderLength } = useGetFullscreenModalSliderLength(false)

  return (
    <React.Fragment>
      <LabelRadiusContainer nativeID={radiusLabelId}>
        <Typo.Body>{`Dans un rayon de\u00a0:`}</Typo.Body>
        <Typo.ButtonText testID="value_radius">{`${aroundRadius}\u00a0km`}</Typo.ButtonText>
      </LabelRadiusContainer>
      <Spacer.Column numberOfSpaces={2} />
      <Slider
        showValues={false}
        values={[aroundRadius]}
        min={MIN_RADIUS}
        max={MAX_RADIUS}
        onValuesChange={onValuesChange}
        shouldShowMinMaxValues
        minMaxValuesComplement={`\u00a0km`}
        maxLabel="Dans un rayon de&nbsp;:"
        formatValues={formatKm}
        sliderLength={sliderLength}
        accessibilityLabelledBy={radiusLabelId}
      />
    </React.Fragment>
  )
}

const LabelRadiusContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})
