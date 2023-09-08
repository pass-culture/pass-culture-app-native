import React, { FunctionComponent } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components/native'

import { CreditStatusTag } from 'features/tutorial/components/CreditStatusTag'
import { customEaseInOut, DURATION_IN_MS } from 'features/tutorial/helpers/animationProps'
import { getBackgroundColor } from 'features/tutorial/helpers/getBackgroundColor'
import { CreditStatus } from 'features/tutorial/types'
import { AnimatedView, NAV_DELAY_IN_MS } from 'libs/react-native-animatable'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  age: number
  creditStatus: CreditStatus
  onPress: () => void
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

export const AgeCreditBlock: FunctionComponent<Props> = ({
  age,
  creditStatus,
  onPress,
  children,
}) => {
  const AgeText = creditStatus === CreditStatus.ONGOING ? BodySecondary : Typo.CaptionNeutralInfo

  const statusIsOngoing = creditStatus === CreditStatus.ONGOING

  const ViewComponent = statusIsOngoing ? AnimatedView : View
  const viewProps = statusIsOngoing
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
        <View>
          <AgeText>{`à ${age} ans`}</AgeText>
          <Spacer.Column numberOfSpaces={1} />
          {children}
        </View>
        <TagContainer>
          <CreditStatusTag status={creditStatus} />
        </TagContainer>
      </Container>
    </TouchableWithoutFeedback>
  )
}

const BodySecondary = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))

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
