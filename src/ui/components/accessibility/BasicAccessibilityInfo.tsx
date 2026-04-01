import React from 'react'
import styled from 'styled-components/native'

import { OfferAccessibilityResponse } from 'api/gen'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { HandicapCategory } from 'shared/accessibility/helpers/getAccessibilityCategoryAndIcon'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { AccessibilityBadge } from 'ui/components/accessibility/AccessibilityBadge'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { getSpacing } from 'ui/theme'

type Props = { accessibility: OfferAccessibilityResponse; venueId?: number }

export function BasicAccessibilityInfo({ accessibility, venueId }: Readonly<Props>) {
  const { visualDisability, audioDisability, mentalDisability, motorDisability } = accessibility
  if (
    isNullOrUndefined(visualDisability) &&
    isNullOrUndefined(audioDisability) &&
    isNullOrUndefined(mentalDisability) &&
    isNullOrUndefined(motorDisability)
  )
    return null

  return (
    <React.Fragment>
      <StyledUl testID="BasicAccessibilityInfo">
        {renderAccessibilityBadge(visualDisability, HandicapCategory.VISUAL)}
        {renderAccessibilityBadge(mentalDisability, HandicapCategory.MENTAL)}
        {renderAccessibilityBadge(motorDisability, HandicapCategory.MOTOR)}
        {renderAccessibilityBadge(audioDisability, HandicapCategory.AUDIO)}
      </StyledUl>
      {venueId ? (
        <FlexContainerWithMargin>
          <Banner
            label="Ce lieu n’a pas encore d’informations détaillées sur son accessibilité."
            description="Tu peux nous aider en les renseignant sur Acceslibre."
            links={[
              {
                externalNav: { url: env.ACCES_LIBRE_URL },
                onBeforeNavigate: () =>
                  analytics.logAccessibilityBannerClicked({ action: 'contribute' }),
                wording: 'Renseigner sur Acceslibre',
              },
            ]}
          />
        </FlexContainerWithMargin>
      ) : null}
    </React.Fragment>
  )
}

const renderAccessibilityBadge = (
  disability: boolean | undefined | null,
  handicap: HandicapCategory
) =>
  disability !== null && disability !== undefined ? (
    <StyledLi>
      <AccessibilityBadge handicap={handicap} isAccessible={disability} />
    </StyledLi>
  ) : null

const StyledUl = styled(Ul)(({ theme }) => ({
  flexDirection: 'row',
  overflow: 'visible',
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
  justifyContent: 'space-between',
}))

const StyledLi = styled(Li)<{ rightSpacingValue?: number }>(({ theme }) => ({
  maxWidth: theme.isMobileViewport ? getSpacing(18) : theme.contentPage.maxWidth / 4,
}))

const FlexContainerWithMargin = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.s,
  marginBottom: theme.designSystem.size.spacing.s,
  maxWidth: theme.contentPage.maxWidth,
}))
