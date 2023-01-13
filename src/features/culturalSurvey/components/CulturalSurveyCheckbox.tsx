import React, { FunctionComponent, useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { theme } from 'theme'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { IconInterface } from 'ui/svg/icons/types'
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'

type CulturalSurveyCheckboxProps = {
  title: string
  subtitle?: string | null
  icon?: FunctionComponent<IconInterface> | null
  onPress: () => void
  selected: boolean
}

export const CulturalSurveyCheckbox = (props: CulturalSurveyCheckboxProps) => {
  const [selected, setIsSelected] = useState(props.selected)

  const AnswerIcon = props.icon
    ? styled(props.icon).attrs(({ theme }) => ({
        color: selected ? theme.colors.secondary : theme.colors.greyDark,
        color2: selected ? theme.colors.primary : theme.colors.greyDark,
      }))``
    : null

  const onPress = () => {
    setIsSelected(!selected)
    props.onPress()
  }

  useEffect(() => {
    setIsSelected(props.selected)
  }, [props.selected])

  const colors = selected
    ? [theme.colors.secondary, theme.colors.primary]
    : [theme.colors.greyMedium, theme.colors.greyMedium]

  const accessibilityLabel = props.subtitle ? `${props.title} ${props.subtitle}` : props.title
  return (
    <StyledLinearGradient colors={colors}>
      <AnswerContainer
        {...accessibleCheckboxProps({ checked: selected, label: accessibilityLabel })}
        onPress={onPress}>
        {!!AnswerIcon && (
          <ActivityIconContainer>
            <AnswerIcon />
          </ActivityIconContainer>
        )}
        <DescriptionContainer>
          <Typo.ButtonText>{props.title}</Typo.ButtonText>
          {!!props.subtitle && <Typo.CaptionNeutralInfo>{props.subtitle}</Typo.CaptionNeutralInfo>}
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

const StyledLinearGradient = styled(LinearGradient).attrs(({ colors }) => ({
  colors,
  useAngle: true,
  angle: 175,
}))({ borderRadius: getSpacing(2) })

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
