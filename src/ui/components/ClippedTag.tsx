import React from 'react'
import styled from 'styled-components/native'

import { testID } from 'tests/utils'
import { Clear as ClearIcon } from 'ui/svg/icons/Clear'
import { getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY, ColorsEnum } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  label: string
  onPress: () => void
  testId: string
}

export const ClippedTag: React.FC<Props> = ({ label, onPress, testId }) => {
  return (
    <Container>
      <VenueLabelContainer>
        <VenueLabel>{label}</VenueLabel>
      </VenueLabelContainer>
      <TouchableOpacity onPress={onPress}>
        <ClearIcon size={20} {...testID(testId)} color={ColorsEnum.WHITE} />
      </TouchableOpacity>
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
})

const VenueLabelContainer = styled.View({
  backgroundColor: ColorsEnum.PRIMARY,
  paddingVertical: getSpacing(2),
  paddingLeft: getSpacing(3),
  borderTopLeftRadius: BorderRadiusEnum.CHECKBOX_RADIUS,
  borderBottomLeftRadius: BorderRadiusEnum.CHECKBOX_RADIUS,
  maxWidth: '70%',
})

const VenueLabel = styled(Typo.ButtonText).attrs(() => ({
  numberOfLines: 1,
  color: ColorsEnum.WHITE,
}))({})

const TouchableOpacity = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({
  padding: getSpacing(2),
  backgroundColor: ColorsEnum.PRIMARY,
  borderTopRightRadius: BorderRadiusEnum.BUTTON,
  borderBottomRightRadius: BorderRadiusEnum.BUTTON,
})
