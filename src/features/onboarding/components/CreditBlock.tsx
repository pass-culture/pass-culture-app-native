import React, { FunctionComponent } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components/native'

import { CreditBlockIcon } from 'features/onboarding/components/CreditBlockIcon'
import { CreditStatusTag } from 'features/onboarding/components/CreditStatusTag'
import { customEaseInOut, DURATION_IN_MS } from 'features/onboarding/helpers/animationProps'
import { getBackgroundColor } from 'features/onboarding/helpers/getBackgroundColor'
import { getBorderStyle } from 'features/onboarding/helpers/getBorderStyle'
import { getTitleComponent, getAgeComponent } from 'features/onboarding/helpers/getTextComponent'
import { CreditStatus } from 'features/onboarding/types'
import { AnimatedView, NAV_DELAY_IN_MS } from 'libs/react-native-animatable'
import { getSpacing, getSpacingString, Spacer, Typo } from 'ui/theme'

type Props = {
  title: string
  subtitle: string
  description?: string
  underage: boolean
  roundedBorders?: 'top' | 'bottom' // To determine if top or bottom corners should be rounded more
  creditStatus: CreditStatus
  onPress: () => void
}

const containerAnimation = {
  from: {
    transform: [{ scale: 0.95 }],
  },
  to: {
    transform: [{ scale: 1 }],
  },
}

export const CreditBlock: FunctionComponent<Props> = ({
  title,
  subtitle,
  description,
  underage,
  roundedBorders,
  creditStatus,
  onPress,
}) => {
  const TitleText = getTitleComponent(underage, creditStatus)
  const AgeText = getAgeComponent(underage, creditStatus)

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
      <Container
        as={ViewComponent}
        roundedBorders={roundedBorders}
        status={creditStatus}
        {...viewProps}>
        <IconContainer>
          <CreditBlockIcon status={creditStatus} />
        </IconContainer>
        <View>
          <TitleText>{title}</TitleText>
          <Spacer.Column numberOfSpaces={1} />
          <AgeText>{subtitle}</AgeText>
          {!!description && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={1} />
              <DescriptionText>{description}</DescriptionText>
            </React.Fragment>
          )}
        </View>
        <TagContainer>
          <CreditStatusTag status={creditStatus} roundedBorders={roundedBorders} />
        </TagContainer>
      </Container>
    </TouchableWithoutFeedback>
  )
}

const DescriptionText = styled(Typo.Caption)(({ theme }) => ({
  fontSize: theme.tabBar.fontSize,
  lineHeight: getSpacingString(3),
  color: theme.colors.greyDark,
}))

const Container = styled.View<{
  status: CreditStatus
  roundedBorders?: Props['roundedBorders']
}>(({ theme, status, roundedBorders }) => ({
  ...getBorderStyle(theme, status, roundedBorders),
  backgroundColor: getBackgroundColor(theme, status),
  padding: getSpacing(4),
  flexDirection: 'row',
  alignItems: 'center',
  overflow: 'hidden',
  marginHorizontal: status !== CreditStatus.ONGOING ? getSpacing(1) : 0,
}))

const IconContainer = styled.View({
  marginRight: getSpacing(4),
})

const TagContainer = styled.View({
  position: 'absolute',
  right: 0,
  top: 0,
})
