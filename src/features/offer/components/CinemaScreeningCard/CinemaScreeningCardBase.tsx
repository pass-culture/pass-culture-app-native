import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

import {
  CINEMA_SCREENING_ACCESSIBILITY_ENTRIES,
  CINEMA_SCREENING_CARD_MIN_HEIGHT,
  CINEMA_SCREENING_CARD_WIDTH,
} from './constants'
import { getCinemaScreeningCardColors } from './getCinemaScreeningCardColors'
import { CinemaScreeningCardBaseProps, CinemaScreeningCardStyleProps } from './types'

export const CinemaScreeningCardBase: FunctionComponent<CinemaScreeningCardBaseProps> = ({
  time,
  languages,
  price,
  onPress,
  specialEvent,
  video = [],
  audio = [],
  accessibility = {},
  disabledReason,
  minHeight = CINEMA_SCREENING_CARD_MIN_HEIGHT,
  fillHeight = false,
  onLayout,
  hovered = false,
  onMouseEnter,
  onMouseLeave,
}) => {
  const theme = useTheme()
  const isDisabled = Boolean(disabledReason)
  const isHover = hovered && !isDisabled
  const colors = getCinemaScreeningCardColors({
    disabled: isDisabled,
    hovered: isHover,
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
    isDisabled ? undefined : specialEvent,
    isDisabled ? undefined : mediaTags.join(', '),
    isDisabled ? undefined : displayedAccessibility.map(({ label }) => label).join(', '),
    isDisabled ? undefined : price
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
      minHeight={minHeight}
      backgroundColor={colors.backgroundColor}
      borderColor={colors.borderColor}
      fillHeight={fillHeight}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onLayout={onLayout}>
      <Header>
        <Time color={colors.titleColor}>{time}</Time>
        <Language color={colors.subtitleColor}>{languageLabel}</Language>
      </Header>

      {isDisabled ? <DisabledReason>{disabledReason}</DisabledReason> : null}

      {!isDisabled && specialEvent ? (
        <Tag label={specialEvent} variant={TagVariant.HIGHLIGHT} />
      ) : null}

      {!isDisabled && mediaTags.length ? (
        <TagsRow>
          {mediaTags.map((label, index) => (
            <Tag label={label} key={`${label}-${index}`} />
          ))}
        </TagsRow>
      ) : null}

      {isDisabled ? null : (
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
      )}
    </Card>
  )
}

const Card = styledButton(Touchable)<CinemaScreeningCardStyleProps>(
  ({ theme, minHeight, backgroundColor, borderColor, disabled, fillHeight }) => ({
    width: CINEMA_SCREENING_CARD_WIDTH,
    minHeight,
    boxSizing: 'border-box',
    padding: theme.designSystem.size.spacing.m,
    gap: theme.designSystem.size.spacing.s,
    justifyContent: 'flex-start',
    borderColor,
    borderWidth: 1,
    borderRadius: theme.designSystem.size.borderRadius.m,
    backgroundColor,
    cursor: disabled ? 'default' : 'pointer',
    flexGrow: Platform.OS === 'web' && fillHeight ? 1 : undefined,
    textDecorationLine: 'none',
    ...customFocusOutline({ theme }),
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
