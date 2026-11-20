import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ScreeningFeatures } from 'api/gen'
import { getDisplayedCinemaScreeningFeatures } from 'features/bookings/helpers/getDisplayedCinemaScreeningFeatures'
import { Button } from 'ui/designSystem/Button/Button'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { PlainMore } from 'ui/svg/icons/PlainMore'

type Props = {
  features: ScreeningFeatures
  onPressDetails?: VoidFunction
}

export const CinemaScreeningFeatures: FunctionComponent<Props> = ({ features, onPressDetails }) => {
  const { designSystem } = useTheme()
  const { specialEvent, mediaTags, displayedAccessibility } =
    getDisplayedCinemaScreeningFeatures(features)
  const hasTags = !!specialEvent || mediaTags.length > 0

  return (
    <Container>
      {hasTags ? (
        <Features>
          {specialEvent ? (
            <Tag label={specialEvent} variant={TagVariant.HIGHLIGHT} isMultiline />
          ) : null}
          {mediaTags.map((label, index) => (
            <Tag label={label} key={`${label}-${index}`} isMultiline />
          ))}
        </Features>
      ) : null}
      {displayedAccessibility.length > 0 ? (
        <AccessibilityIcons>
          {displayedAccessibility.map(({ key, Icon, label }) => (
            <Icon
              key={key}
              testID={`booking-cinema-screening-${key}-accessibility`}
              accessibilityLabel={label}
              size={18}
              color={designSystem.color.icon.brandPrimary}
            />
          ))}
        </AccessibilityIcons>
      ) : null}
      {onPressDetails ? (
        <Button
          wording="Informations sur la séance"
          icon={PlainMore}
          variant="tertiary"
          color="neutral"
          size="small"
          onPress={onPressDetails}
        />
      ) : null}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  alignItems: 'flex-start',
  gap: theme.designSystem.size.spacing.s,
}))

const Features = styled.View(({ theme }) => ({
  width: '100%',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.xs,
}))

const AccessibilityIcons = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.s,
}))
