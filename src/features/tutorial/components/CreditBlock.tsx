import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CreditStatusTag } from 'features/tutorial/components/CreditStatusTag'
import { CreditStatus } from 'features/tutorial/enums'
import { customEaseInOut, DURATION_IN_MS } from 'features/tutorial/helpers/animationProps'
import { getBackgroundColor } from 'features/tutorial/helpers/getBackgroundColor'
import { AnimatedView, NAV_DELAY_IN_MS } from 'libs/react-native-animatable'
import { TouchableWithoutFeedback } from 'ui/components/touchable/TouchableWithoutFeedback'
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
          <CreditStatusTag status={creditStatus} />
        </TagContainer>
      </Container>
    </TouchableWithoutFeedback>
  )
}

const Container = styled.View<{
  status: CreditStatus
}>(({ theme, status }) => ({
  borderColor:
    status === CreditStatus.ONGOING ? theme.colors.greySemiDark : getBackgroundColor(theme, status),
  borderWidth: getSpacing(0.25),
  borderRadius: getSpacing(1),
  backgroundColor: getBackgroundColor(theme, status),
  padding: getSpacing(4),
  overflow: 'hidden',
  marginHorizontal: status !== CreditStatus.ONGOING ? getSpacing(1) : 0,
}))

const TagContainer = styled.View({
  position: 'absolute',
  right: 0,
  top: 0,
})
