import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/enums'
import { customEaseInOut, DURATION_IN_MS } from 'features/onboarding/helpers/animationProps'
import { getTagVariantFromCreditStatus } from 'features/onboarding/helpers/getTagVariantFromCreditStatus'
import { AnimatedView, NAV_DELAY_IN_MS } from 'libs/react-native-animatable'
import { TouchableWithoutFeedback } from 'ui/components/touchable/TouchableWithoutFeedback'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { getSpacing } from 'ui/theme'

type Props = {
  creditStatus: CreditStatus
  animated?: boolean
  onPress?: () => void
  children?: React.ReactNode
}

const containerAnimation = {
  from: {
    transform: [{ scale: 0.95 }],
  },
  to: {
    transform: [{ scale: 1 }],
  },
}

export const CreditBlock = ({ creditStatus, animated, onPress, children }: Props) => {
  const ViewComponent = animated ? AnimatedView : View
  const viewProps = animated
    ? {
        duration: DURATION_IN_MS,
        animation: containerAnimation,
        delay: NAV_DELAY_IN_MS,
        easing: customEaseInOut,
      }
    : {}
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Container as={ViewComponent} status={creditStatus} {...viewProps}>
        <View>{children}</View>
        <TagContainer>
          <Tag label={creditStatus} variant={getTagVariantFromCreditStatus(creditStatus)} />
        </TagContainer>
      </Container>
    </TouchableWithoutFeedback>
  )
}

const Container = styled.View<{
  status: CreditStatus
}>(({ theme, status }) => ({
  borderColor:
    status === CreditStatus.ONGOING
      ? theme.designSystem.color.border.selected
      : theme.designSystem.color.border.disabled,
  borderWidth: getSpacing(0.25),
  borderRadius: theme.designSystem.size.borderRadius.s,
  padding: theme.designSystem.size.spacing.l,
  overflow: 'hidden',
  marginHorizontal: status === CreditStatus.ONGOING ? 0 : getSpacing(1),
}))

const TagContainer = styled.View({
  position: 'absolute',
  right: 8,
  top: 8,
})
