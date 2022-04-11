import React, { FunctionComponent, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { IconInterface } from 'ui/svg/icons/types'
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'

type CulturalSurveyCheckboxProps = {
  title?: string
  subtitle?: string | null
  icon?: FunctionComponent<IconInterface> | null
}

export const CulturalSurveyCheckbox = (props: CulturalSurveyCheckboxProps) => {
  const [selected, setIsSelected] = useState(false)

  const AnswerIcon = props.icon
    ? styled(props.icon).attrs(({ theme }) => ({
        color: selected ? theme.colors.secondary : theme.colors.greyDark,
        color2: selected ? theme.colors.primary : theme.colors.greyDark,
      }))``
    : null

  const StyledLinearGradient = styled(LinearGradient).attrs(({ theme }) => ({
    colors: selected
      ? [theme.colors.secondary, theme.colors.primary]
      : [theme.colors.greyMedium, theme.colors.greyMedium],
    useAngle: true,
    angle: 175,
  }))({ borderRadius: getSpacing(2) })

  // TODO (PC-13439) yorickeando : delete this once the component is connected to the backend data
  const title = props.title ?? 'Visité un musée,'

  return (
    <StyledLinearGradient>
      <AnswerContainer onPress={() => setIsSelected(!selected)} testID={'CulturalSurveyAnswer'}>
        {!!AnswerIcon && (
          <ActivityIconContainer>
            <AnswerIcon />
          </ActivityIconContainer>
        )}
        <DescriptionContainer>
          <Typo.ButtonText>{title}</Typo.ButtonText>
          {!!props.subtitle && <GreyCaption>{props?.subtitle}</GreyCaption>}
        </DescriptionContainer>
        {!!selected && (
          <ValidateIconContainer>
            <RedValidate />
          </ValidateIconContainer>
        )}
      </AnswerContainer>
    </StyledLinearGradient>
  )
}

const RedValidate = styled(Validate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.smaller,
}))``

const AnswerContainer = styled(TouchableOpacity).attrs({
  activeOpacity: 0.95,
})(({ theme }) => ({
  flexDirection: 'row',
  backgroundColor: theme.colors.white,
  justifyContent: 'flex-start',
  alignItems: 'center',
  margin: getSpacing(0.25),
  borderRadius: getSpacing(1.8),
  minHeight: getSpacing(18),
}))

const GreyCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const DescriptionContainer = styled.View({
  flexShrink: 1,
  marginLeft: getSpacing(4),
  marginRight: getSpacing(10),
})

const ValidateIconContainer = styled.View({
  alignContent: 'center',
  position: 'absolute',
  right: getSpacing(4),
})
const ActivityIconContainer = styled.View({
  alignContent: 'center',
  marginLeft: getSpacing(4),
})
