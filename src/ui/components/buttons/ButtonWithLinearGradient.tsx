import React from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { Rectangle } from 'ui/svg/Rectangle'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  wording: string
  onPress: (() => void) | (() => Promise<void>) | undefined
  isDisabled: boolean
  isExternal?: boolean
}

export const ButtonWithLinearGradient: React.FC<Props> = ({
  wording,
  onPress,
  isDisabled,
  isExternal = false,
}) => (
  <Container onPress={onPress} disabled={isDisabled} {...accessibilityAndTestId(wording)}>
    {isDisabled ? <DisabledRectangle /> : <Rectangle height={getSpacing(12)} size="100%" />}
    <LegendContainer>
      {!!isExternal && <ExternalSite size={20} color={ColorsEnum.WHITE} />}
      <Title adjustsFontSizeToFit numberOfLines={1}>
        {wording}
      </Title>
    </LegendContainer>
  </Container>
)

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: BorderRadiusEnum.BUTTON,
  overflow: 'hidden',
})

const Title = styled(Typo.ButtonText)({
  color: ColorsEnum.WHITE,
  padding: getSpacing(5),
})

const LegendContainer = styled.View({
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'row',
})

const DisabledRectangle = styled.View({
  width: '100%',
  height: getSpacing(12),
  backgroundColor: ColorsEnum.PRIMARY_DISABLED,
})
