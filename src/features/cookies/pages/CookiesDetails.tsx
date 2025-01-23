import React from 'react'
import styled from 'styled-components/native'

import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { CookiesChoiceSettings } from 'features/cookies/types'
import { env } from 'libs/environment'
import { Accordion } from 'ui/components/Accordion'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const CookiesDetails = (props: CookiesChoiceSettings) => {
  const buttonText = 'Pour plus d’informations, nous t’invitons à consulter notre'
  return (
    <StyledView>
      <AccordionContainer>
        <StyledAccordionItem>
          <TypoDS.Body>
            Les cookies sont des petits fichiers stockés sur ton appareil lorsque tu navigues. Tu
            peux choisir d’accepter ou non l’activation de leur suivi. Nous utilisons les données
            collectées par ces cookies et traceurs pour t’offrir la meilleure expérience possible.
          </TypoDS.Body>
        </StyledAccordionItem>
      </AccordionContainer>
      <CookiesSettingsContainer>
        <CookiesSettings {...props} />
      </CookiesSettingsContainer>
      <ViewGap gap={4}>
        <TypoDS.Title4 {...getHeadingAttrs(2)}>Tu as la main dessus</TypoDS.Title4>
        <TypoDS.Body>
          Ton choix est conservé pendant 6 mois et tu pourras le modifier dans les paramètres de
          confidentialité de ton profil à tout moment.
        </TypoDS.Body>
        <TypoDS.Body>
          On te redemandera bien sûr ton consentement si notre politique évolue.
        </TypoDS.Body>
        <CaptionNeutralInfo>
          {buttonText}
          <Spacer.Row numberOfSpaces={1} />
          <ExternalTouchableLink
            as={ButtonInsideText}
            wording="Politique de gestion des cookies"
            externalNav={{ url: env.COOKIES_POLICY_LINK }}
            icon={ExternalSiteFilled}
            typography="BodyAccentXs"
          />
        </CaptionNeutralInfo>
      </ViewGap>
    </StyledView>
  )
}

const ACCORDION_BORDER_RADIUS = getSpacing(2)
const StyledAccordionItem = styled(Accordion).attrs(({ theme }) => ({
  title: <TypoDS.BodyAccent>Qu’est-ce que les cookies&nbsp;?</TypoDS.BodyAccent>,
  titleStyle: {
    backgroundColor: theme.colors.greyLight,
    paddingVertical: getSpacing(4),
  },
  bodyStyle: {
    backgroundColor: theme.colors.greyLight,
    paddingBottom: getSpacing(4),
  },
}))``

const AccordionContainer = styled.View({
  borderRadius: ACCORDION_BORDER_RADIUS,
  overflow: 'hidden',
})

const CaptionNeutralInfo = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const CookiesSettingsContainer = styled.View({ paddingVertical: getSpacing(8) })

const StyledView = styled.View({ marginBottom: getSpacing(8) })
