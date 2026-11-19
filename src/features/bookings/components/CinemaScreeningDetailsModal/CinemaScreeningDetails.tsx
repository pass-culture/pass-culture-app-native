import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { CINEMA_SCREENING_ACCESSIBILITY_ENTRIES } from 'features/offer/components/CinemaScreeningCard/constants'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Typo } from 'ui/theme'

import { CinemaScreeningDetail } from './types'

type Props = {
  details: CinemaScreeningDetail[]
}

export const CinemaScreeningDetails: FunctionComponent<Props> = ({ details }) => {
  const { designSystem } = useTheme()

  return (
    <DetailsContainer gap={4}>
      {details.map((detail, index) => (
        <DetailGroup key={`${detail.category}-${detail.label}-${index}`} gap={4}>
          {index > 0 ? <Separator.Horizontal color={designSystem.color.border.subtle} /> : null}

          <DetailContainer testID={`cinema-screening-detail-${detail.category}-${index}`} gap={1}>
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
    <AccessibilityTitle gap={1}>
      {Icon ? <Icon size={24} color={designSystem.color.icon.brandPrimary} /> : null}
      <AccessibilityLabel>{label}</AccessibilityLabel>
    </AccessibilityTitle>
  )
}

const DetailsContainer = styled(ViewGap)({
  width: '100%',
})

const DetailGroup = styled(ViewGap)({
  width: '100%',
})

const DetailContainer = styled(ViewGap)({
  width: '100%',
})

const AccessibilityTitle = styled(ViewGap)({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
})

const AccessibilityLabel = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
  flexShrink: 1,
}))

const Description = styled(Typo.BodyXs)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
}))
