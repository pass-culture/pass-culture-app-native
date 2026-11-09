import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Typo } from 'ui/theme'

import {
  CINEMA_SCREENING_ACCESSIBILITY_ENTRIES,
  CINEMA_SCREENING_CARD_MIN_HEIGHT,
  CINEMA_SCREENING_CARD_WIDTH,
} from './constants'
import { getCinemaScreeningCardColors } from './getCinemaScreeningCardColors'
import { CinemaScreeningCardComponentProps, CinemaScreeningCardStyleProps } from './types'

export const CinemaScreeningCard: FunctionComponent<CinemaScreeningCardComponentProps> = ({
  time,
  languages,
  price,
  onPress,
  specialEvent,
  video = [],
  audio = [],
  accessibility = {},
  isDisabled: isDisabledProp,
  disabledReason,
  fillHeight = false,
  hovered,
}) => {
  const theme = useTheme()
  const hoverProps = useHandleHover()
  const isDisabled = !!isDisabledProp || !!disabledReason
  const shouldDisplayDetails = !disabledReason
  const colors = getCinemaScreeningCardColors({
    disabled: isDisabled,
    hovered: hovered ?? hoverProps.isHover,
    theme,
  })
  const languageLabel = languages.join(', ')
  const mediaTags = [...video, ...audio]
  const displayedAccessibility = CINEMA_SCREENING_ACCESSIBILITY_ENTRIES.filter(
    ({ key }) => accessibility[key]?.length
  )

  const accessibilityLabel = getComputedAccessibilityLabel(
    time,
    languageLabel,
    disabledReason,
    shouldDisplayDetails ? specialEvent : undefined,
    shouldDisplayDetails ? mediaTags.join(', ') : undefined,
    shouldDisplayDetails ? displayedAccessibility.map(({ label }) => label).join(', ') : undefined,
    shouldDisplayDetails ? price : undefined
  )

  return (
    <Card
      testID="cinema-screening-card"
      onPress={onPress}
      activeOpacity={0.6}
      disabled={isDisabled}
      accessibilityRole={AccessibilityRole.BUTTON}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled }}
      backgroundColor={colors.backgroundColor}
      borderColor={colors.borderColor}
      fillHeight={fillHeight}
      onMouseEnter={hoverProps.onMouseEnter}
      onMouseLeave={hoverProps.onMouseLeave}>
      <Header>
        <Time color={colors.titleColor}>{time}</Time>
        <Language color={colors.subtitleColor}>{languageLabel}</Language>
      </Header>

      {disabledReason ? <DisabledReason>{disabledReason}</DisabledReason> : null}

      {shouldDisplayDetails && specialEvent ? (
        <Tag label={specialEvent} variant={TagVariant.HIGHLIGHT} isMultiline />
      ) : null}

      {shouldDisplayDetails && mediaTags.length ? (
        <TagsRow>
          {mediaTags.map((label, index) => (
            <Tag label={label} key={`${label}-${index}`} isMultiline />
          ))}
        </TagsRow>
      ) : null}

      {shouldDisplayDetails ? (
        <Footer>
          <AccessibilityRow>
            {displayedAccessibility.map(({ key, Icon, label }) => (
              <Icon
                key={key}
                testID={`cinema-screening-${key}-accessibility`}
                accessibilityLabel={label}
                size={18}
                color={colors.iconColor}
              />
            ))}
          </AccessibilityRow>
          <Price color={colors.priceColor}>{price}</Price>
        </Footer>
      ) : null}
    </Card>
  )
}

const Card = styled(TouchableOpacity)<CinemaScreeningCardStyleProps>(
  ({ theme, backgroundColor, borderColor, disabled, fillHeight }) => ({
    width: CINEMA_SCREENING_CARD_WIDTH,
    minHeight: CINEMA_SCREENING_CARD_MIN_HEIGHT,
    boxSizing: 'border-box',
    padding: theme.designSystem.size.spacing.m,
    gap: theme.designSystem.size.spacing.s,
    justifyContent: 'flex-start',
    borderColor,
    borderWidth: 1,
    borderRadius: theme.designSystem.size.borderRadius.m,
    backgroundColor,
    cursor: disabled ? 'default' : 'pointer',
    flexGrow: fillHeight ? 1 : undefined,
    textDecorationLine: 'none',
    ...(Platform.OS === 'web'
      ? {
          '&:hover': { textDecoration: 'none' },
          '&:hover *': { textDecoration: 'none' },
        }
      : {}),
  })
)

const Header = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
})

const Time = styled(Typo.Title2)<{ color: string }>(({ color }) => ({ color }))

const Language = styled(Typo.BodyAccentXs)<{ color: string }>(({ color }) => ({ color }))

const DisabledReason = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
}))

const TagsRow = styled.View(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.xs,
}))

const Footer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 'auto',
})

const AccessibilityRow = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.xs,
}))

const Price = styled(Typo.BodyAccent)<{ color: string }>(({ color }) => ({
  color,
  textAlign: 'right',
}))
