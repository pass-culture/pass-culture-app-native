import React, { FunctionComponent, ReactElement } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  LeftIcon: ReactElement
  title: string
  subtitle: string
  onPress: VoidFunction
  accessibilityLabel: string
}

export const SystemBanner: FunctionComponent<Props> = ({
  LeftIcon,
  title,
  subtitle,
  onPress,
  accessibilityLabel,
}) => {
  return (
    <Touchable onPress={onPress} accessibilityLabel={accessibilityLabel}>
      <Container testID="systemBanner">
        {LeftIcon ? <IconContainer>{LeftIcon}</IconContainer> : null}
        <DescriptionContainer>
          <Typo.ButtonText>{title}</Typo.ButtonText>
          <Spacer.Column numberOfSpaces={1} />
          <Typo.Body numberOfLines={2}>{subtitle}</Typo.Body>
        </DescriptionContainer>
        <View>
          <StyledArrowRightIcon />
        </View>
      </Container>
    </Touchable>
  )
}

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: theme.borderRadius.radius,
  borderColor: theme.colors.secondaryLight200,
  padding: getSpacing(4),
  width: '100%',
}))

const IconContainer = styled.View({
  alignContent: 'center',
  marginRight: getSpacing(4),
})

const DescriptionContainer = styled.View({
  flexShrink: 1,
  flexGrow: 1,
  marginRight: getSpacing(4),
  textAlign: 'start',
})

const StyledArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  color: theme.colors.secondaryLight200,
}))``
