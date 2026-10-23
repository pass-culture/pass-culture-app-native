import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { CINEMA_SCREENING_ACCESSIBILITY_ENTRIES } from 'features/offer/components/CinemaScreeningCard/constants'
import { Separator } from 'ui/components/Separator'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Typo } from 'ui/theme'

import { CinemaScreeningDetail } from './types'

type Props = {
  details: readonly CinemaScreeningDetail[]
}

export const CinemaScreeningDetails: FunctionComponent<Props> = ({ details }) => {
  const { designSystem } = useTheme()

  return (
    <DetailsContainer>
      {details.map((detail, index) => (
        <DetailGroup key={`${detail.category}-${detail.label}-${index}`}>
          {index > 0 ? <Separator.Horizontal color={designSystem.color.border.subtle} /> : null}

          <DetailContainer testID={`cinema-screening-detail-${detail.category}-${index}`}>
            {detail.type === 'tag' ? (
              <Tag
                label={detail.label}
                variant={
                  detail.category === 'special-event' ? TagVariant.HIGHLIGHT : TagVariant.DEFAULT
                }
              />
            ) : (
              <AccessibilityDetailTitle category={detail.category} label={detail.label} />
            )}
            <Description>{detail.description}</Description>
          </DetailContainer>
        </DetailGroup>
      ))}
    </DetailsContainer>
  )
}

const AccessibilityDetailTitle = ({
  category,
  label,
}: Pick<Extract<CinemaScreeningDetail, { type: 'accessibility' }>, 'category' | 'label'>) => {
  const { designSystem } = useTheme()
  const Icon = CINEMA_SCREENING_ACCESSIBILITY_ENTRIES.find(({ key }) => key === category)?.Icon

  return (
    <AccessibilityTitle>
      {Icon ? <Icon size={24} color={designSystem.color.icon.brandPrimary} /> : null}
      <AccessibilityLabel>{label}</AccessibilityLabel>
    </AccessibilityTitle>
  )
}

const DetailsContainer = styled.View(({ theme }) => ({
  width: '100%',
  rowGap: theme.designSystem.size.spacing.l,
}))

const DetailGroup = styled.View(({ theme }) => ({
  width: '100%',
  rowGap: theme.designSystem.size.spacing.l,
}))

const DetailContainer = styled.View(({ theme }) => ({
  width: '100%',
  rowGap: theme.designSystem.size.spacing.xs,
}))

const AccessibilityTitle = styled.View(({ theme }) => ({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  columnGap: theme.designSystem.size.spacing.xs,
}))

const AccessibilityLabel = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
  flexShrink: 1,
}))

const Description = styled(Typo.BodyXs)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
}))
