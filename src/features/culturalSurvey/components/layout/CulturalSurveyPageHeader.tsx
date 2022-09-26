import React from 'react'
import styled from 'styled-components/native'

import { CulturalSurveyProgressBar } from 'features/culturalSurvey/components/CulturalSurveyProgressBar'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  title: string
  progress: number
  onGoBack?: () => void
}

export const CulturalSurveyPageHeader: React.FC<Props> = (props) => (
  <HeaderContainer>
    <BackIcon onGoBack={props.onGoBack} />
    <BarAndTitle>
      <BarContainer>
        <CulturalSurveyProgressBar progress={props.progress} />
      </BarContainer>
      <Title>{props.title}</Title>
    </BarAndTitle>
  </HeaderContainer>
)

const HeaderContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: theme.appBarHeight,
}))

const BarAndTitle = styled.View({
  flexDirection: 'row',
  marginLeft: getSpacing(11),
  justifyContent: 'space-between',
  flex: 1,
})

const Title = styled(Typo.Title4).attrs(() => ({ ...getHeadingAttrs(1), numberOfLines: 1 }))({
  flex: 1,
  marginRight: getSpacing(6),
  textAlign: 'right',
})

interface BackButtonProps {
  onGoBack?: () => void
}

const BackIcon: React.FC<BackButtonProps> = (props) => {
  const { goBack } = useGoBack(...homeNavConfig)
  return (
    <StyledTouchableOpacity
      onPress={props.onGoBack ?? goBack}
      {...accessibilityAndTestId('Revenir en arrière')}>
      <ArrowPrevious testID="icon-back" />
    </StyledTouchableOpacity>
  )
}

const BarContainer = styled.View({
  flex: 1,
  marginRight: getSpacing(5),
})

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  color: theme.colors.black,
  size: theme.icons.sizes.small,
}))``

const StyledTouchableOpacity = styled(TouchableOpacity)({
  position: 'absolute',
  left: getSpacing(3),
})
