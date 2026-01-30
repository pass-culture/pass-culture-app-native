import React, { FC } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityData } from 'api/gen'
import { analytics } from 'libs/analytics/provider'
import { getDetailedAccessibilityInfo } from 'shared/accessibility/getDetailedAccessibilityInfo'
import { AccessibilityFrame } from 'ui/components/accessibility/AccessibilityFrame'
import { Accordion } from 'ui/components/Accordion'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  url: string
  accessibilities?: AccessibilityData | null
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
              titleComponent={Typo.BodyAccentXs}
              onOpen={() => analytics.logHasOpenedAccessibilityAccordion(detail.category)}
              leftComponent={
                <AccessibilityFrame Icon={detail.icon} isAccessible={!!detail.isAccessible} />
              }>
              <ViewGap gap={3}>
                {Object.entries(detail.description).map(([descriptionTitle, descriptionInfo]) => (
                  <View
                    key={descriptionTitle}
                    accessibilityLabel={`${descriptionTitle}: ${descriptionInfo}`}>
                    <Typo.BodyXs accessibilityHidden>{descriptionTitle}</Typo.BodyXs>
                    <Spacer.Column numberOfSpaces={2} />
                    {Array.isArray(descriptionInfo) ? (
                      descriptionInfo.map((info) => (
                        <Typo.Body key={info} accessibilityHidden>
                          {info}
                        </Typo.Body>
                      ))
                    ) : (
                      <Typo.Body accessibilityHidden>{descriptionInfo}</Typo.Body>
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
        <Banner
          label="Tu peux retrouver des informations supplémentaires sur l’accessibilité de ce lieu sur le site d’acceslibre."
          links={[
            {
              externalNav: { url },
              onBeforeNavigate: () => analytics.logAccessibilityBannerClicked(acceslibreId),
              wording: 'Voir plus d’infos sur l’accessibilité du lieu',
            },
          ]}
        />
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

const StyledAccordionItem = styled(Accordion).attrs(({ theme }) => ({
  titleStyle: {
    paddingVertical: theme.designSystem.size.spacing.l,
    paddingHorizontal: 0,
  },
  bodyStyle: {
    paddingBottom: theme.designSystem.size.spacing.l,
    paddingHorizontal: 0,
  },
}))``
