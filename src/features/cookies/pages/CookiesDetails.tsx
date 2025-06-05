import React from 'react'
import styled from 'styled-components/native'

import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { CookiesChoiceSettings } from 'features/cookies/types'
import { env } from 'libs/environment/env'
import { Accordion } from 'ui/components/Accordion'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const CookiesDetails = (props: CookiesChoiceSettings) => {
  const buttonText = 'Pour plus d’informations, nous t’invitons à consulter notre'
  return (
    <StyledView>
      <AccordionContainer>
        <StyledAccordionItem>
          <Typo.Body>
            Les cookies sont des petits fichiers stockés sur ton appareil lorsque tu navigues. Tu
            peux choisir d’accepter ou non l’activation de leur suivi. Nous utilisons les données
            collectées par ces cookies et traceurs pour t’offrir la meilleure expérience possible.
          </Typo.Body>
        </StyledAccordionItem>
      </AccordionContainer>
      <CookiesSettingsContainer>
        <CookiesSettings {...props} />
      </CookiesSettingsContainer>
      <ViewGap gap={4}>
        <Typo.Title4 {...getHeadingAttrs(2)}>Tu as la main dessus</Typo.Title4>
        <Typo.Body>
          Ton choix est conservé pendant 6 mois et tu pourras le modifier dans les paramètres de
          confidentialité de ton profil à tout moment.
        </Typo.Body>
        <Typo.Body>
          On te redemandera bien sûr ton consentement si notre politique évolue.
        </Typo.Body>
        <StyledBodyAccentXs>
          {buttonText}
          <Spacer.Row numberOfSpaces={1} />
          <ExternalTouchableLink
            as={ButtonInsideText}
            wording="Politique de gestion des cookies"
            externalNav={{ url: env.COOKIES_POLICY_LINK }}
            icon={ExternalSiteFilled}
            typography="BodyAccentXs"
          />
        </StyledBodyAccentXs>
      </ViewGap>
    </StyledView>
  )
}

const ACCORDION_BORDER_RADIUS = getSpacing(2)
const StyledAccordionItem = styled(Accordion).attrs(({ theme }) => ({
  title: <Typo.BodyAccent>Qu’est-ce que les cookies&nbsp;?</Typo.BodyAccent>,
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

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const CookiesSettingsContainer = styled.View({ paddingVertical: getSpacing(8) })

const StyledView = styled.View({ marginBottom: getSpacing(8) })
