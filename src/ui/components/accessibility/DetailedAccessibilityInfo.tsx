import React, { FC } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ExternalAccessibilityDataModel } from 'api/gen'
import { analytics } from 'libs/analytics/provider'
import { getDetailedAccessibilityInfo } from 'shared/accessibility/getDetailedAccessibilityInfo'
import { AccessibilityFrame } from 'ui/components/accessibility/AccessibilityFrame'
import { Accordion } from 'ui/components/Accordion'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

type Props = {
  url: string
  accessibilities?: ExternalAccessibilityDataModel | null
  acceslibreId?: string | null
}

export const DetailedAccessibilityInfo: FC<Props> = ({ url, accessibilities, acceslibreId }) => {
  const details = getDetailedAccessibilityInfo(accessibilities)

  return (
    <Container>
      <FlexContainer>
        {details?.map((detail, index) => (
          <React.Fragment key={detail.category}>
            <StyledAccordionItem
              accessibilityLabel={`${detail.category}: ${detail.isAccessible ? 'Accessible' : 'Non accessible'}`}
              title={detail.category}
              titleComponent={TypoDS.BodyAccentXs}
              onOpen={() => analytics.logHasOpenedAccessibilityAccordion(detail.category)}
              leftComponent={
                <AccessibilityFrame Icon={detail.icon} isAccessible={!!detail.isAccessible} />
              }>
              <ViewGap gap={3}>
                {Object.entries(detail.description).map(([descriptionTitle, descriptionInfo]) => (
                  <View
                    key={descriptionTitle}
                    accessibilityLabel={`${descriptionTitle}: ${descriptionInfo}`}>
                    <TypoDS.BodyXs accessibilityHidden>{descriptionTitle}</TypoDS.BodyXs>
                    <Spacer.Column numberOfSpaces={2} />
                    {Array.isArray(descriptionInfo) ? (
                      descriptionInfo.map((info) => (
                        <TypoDS.Body key={info} accessibilityHidden>
                          {info}
                        </TypoDS.Body>
                      ))
                    ) : (
                      <TypoDS.Body accessibilityHidden>{descriptionInfo}</TypoDS.Body>
                    )}
                  </View>
                ))}
              </ViewGap>
            </StyledAccordionItem>
            {index === details.length - 1 ? null : (
              <Separator.Horizontal testID="horizontal-separator" />
            )}
          </React.Fragment>
        ))}
      </FlexContainer>
      <Spacer.Row numberOfSpaces={12} />
      <FlexContainer>
        <Spacer.Column numberOfSpaces={2} />
        <InfoBanner message="Tu peux retrouver des informations supplémentaires sur l’accessibilité de ce lieu sur le site d’acceslibre.">
          <Spacer.Column numberOfSpaces={2} />
          <ExternalTouchableLink
            as={ButtonQuaternarySecondary}
            externalNav={{ url }}
            onBeforeNavigate={() => analytics.logAccessibilityBannerClicked(acceslibreId)}
            wording="Voir plus d’infos sur l’accessibilité du lieu"
            icon={ExternalSiteFilled}
            justifyContent="flex-start"
            inline
          />
        </InfoBanner>
      </FlexContainer>
      <Spacer.Column numberOfSpaces={2} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  ...(theme.isDesktopViewport && {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  }),
}))

const FlexContainer = styled.View(({ theme }) => ({
  ...(theme.isDesktopViewport && {
    flex: 1,
  }),
}))

const StyledAccordionItem = styled(Accordion).attrs({
  titleStyle: {
    paddingVertical: getSpacing(4),
    paddingHorizontal: 0,
  },
  bodyStyle: {
    paddingBottom: getSpacing(4),
    paddingHorizontal: 0,
  },
})``
