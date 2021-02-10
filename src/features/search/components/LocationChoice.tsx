import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'libs/algolia'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo, ColorsEnum } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

type Props = {
  locationType: LocationType
  testID: string
  onPress?: () => void
  arrowNext?: boolean
}

export const LocationChoice: React.FC<Props> = (props) => {
  const { locationType, onPress, arrowNext = false, testID } = props
  const { Icon, label, isSelected } = useLocationChoice(locationType)
  const iconColor2 = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.SECONDARY

  return (
    <Container onPress={onPress} testID={`locationChoice-${testID}`}>
      <FirstPart>
        <Icon size={48} color2={iconColor2} />
        <Spacer.Row numberOfSpaces={2} />
        <Typo.ButtonText
          numberOfLines={3}
          color={isSelected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK}>
          {label}
        </Typo.ButtonText>
      </FirstPart>
      {isSelected && (
        <ValidateIconContainer>
          <Validate color={ColorsEnum.PRIMARY} testID="validateIcon" />
        </ValidateIconContainer>
      )}
      {arrowNext ? (
        <React.Fragment>
          <Spacer.Row numberOfSpaces={2} />
          <ArrowNext />
        </React.Fragment>
      ) : (
        <Spacer.Row numberOfSpaces={10} />
      )}
    </Container>
  )
}

const FirstPart = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
})

const ValidateIconContainer = styled.View({
  width: getSpacing(16),
  alignItems: 'flex-end',
})

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginHorizontal: getSpacing(6),
})
