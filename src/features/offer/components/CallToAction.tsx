import React from 'react'
import styled from 'styled-components/native'

import { Rectangle } from 'ui/svg/Rectangle'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  wording: Element | string
  onPress: (() => void) | (() => Promise<void>) | undefined
}

export const CallToAction: React.FC<Props> = ({ wording, onPress }) => {
  const isDisabled = onPress === undefined
  return (
    <Container onPress={onPress} disabled={isDisabled}>
      {isDisabled ? <DisabledRectangle /> : <Rectangle height={getSpacing(12)} size="100%" />}
      <Title adjustsFontSizeToFit numberOfLines={1}>
        {wording}
      </Title>
    </Container>
  )
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: BorderRadiusEnum.BUTTON,
  overflow: 'hidden',
})

const Title = styled(Typo.ButtonText)({
  position: 'absolute',
  color: ColorsEnum.WHITE,
  padding: getSpacing(5),
})

const DisabledRectangle = styled.View({
  width: '100%',
  height: getSpacing(12),
  backgroundColor: ColorsEnum.PRIMARY_DISABLED,
})
