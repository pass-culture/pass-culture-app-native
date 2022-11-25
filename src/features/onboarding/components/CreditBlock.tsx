import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CreditStatusTag } from 'features/onboarding/components/CreditStatusTag'
import { getBackgroundColor } from 'features/onboarding/helpers/getBackgroundColor'
import { getBorderStyle } from 'features/onboarding/helpers/getBorderStyle'
import { getTitleComponent, getAgeComponent } from 'features/onboarding/helpers/getTextComponent'
import { CreditStatus } from 'features/onboarding/types'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { Lock } from 'ui/svg/icons/Lock'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  title: string
  subtitle: string
  description: string
  underage: boolean
  position?: 'top' | 'bottom' // To determine if top or bottom corners should be rounded more
  creditStatus: CreditStatus
}

export const CreditBlock: FunctionComponent<Props> = ({
  title,
  subtitle,
  description,
  underage,
  position,
  creditStatus,
}) => {
  const TitleText = getTitleComponent(underage, creditStatus)
  const AgeText = getAgeComponent(underage, creditStatus)
  const Icon = creditStatus === CreditStatus.ONGOING ? BicolorUnlock : StyledLock

  return (
    <Container position={position} status={creditStatus}>
      <IconContainer>
        <Icon status={creditStatus} />
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
        <CreditStatusTag status={creditStatus} />
      </TagContainer>
    </Container>
  )
}

const StyledLock = styled(Lock).attrs<{ status: CreditStatus }>(({ theme, status }) => ({
  color: status === CreditStatus.GONE ? theme.colors.greyMedium : theme.colors.greyDark,
}))<{ status: CreditStatus }>``

const DescriptionText = styled(Typo.Caption)(({ theme }) => ({
  fontSize: theme.tabBar.fontSize,
  lineHeight: getSpacing(3),
  color: theme.colors.greyDark,
}))

const ONGOING_WIDTH = '102.5%'
const ONGOING_HEIGHT = '102.5%'
const Container = styled.View<{ status: CreditStatus; position?: Props['position'] }>(
  ({ theme, status, position }) => ({
    ...getBorderStyle(theme, status, position),
    backgroundColor: getBackgroundColor(theme, status),
    padding: getSpacing(4),
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    width: status === CreditStatus.ONGOING ? ONGOING_WIDTH : '100%',
    height: status === CreditStatus.ONGOING ? ONGOING_HEIGHT : '100%',
  })
)

const IconContainer = styled.View({
  marginRight: getSpacing(4),
})

const TagContainer = styled.View({
  position: 'absolute',
  right: 0,
  top: 0,
})
