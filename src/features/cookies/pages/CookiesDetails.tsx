import React from 'react'
import styled from 'styled-components/native'

import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { CookiesChoiceSettings } from 'features/cookies/types'
import { env } from 'libs/environment'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const CookiesDetails = (props: CookiesChoiceSettings) => {
  const buttonText = 'Pour plus d’informations, nous t’invitons à consulter notre'
  return (
    <React.Fragment>
      <AccordionContainer>
        <StyledAccordionItem>
          <Typo.Body>
            Les cookies sont des petits fichiers stockés sur ton appareil lorsque tu navigues. Tu
            peux choisir d’accepter ou non l’activation de leur suivi. Nous utilisons les données
            collectées par ces cookies et traceurs pour t’offrir la meilleure expérience possible.
          </Typo.Body>
        </StyledAccordionItem>
      </AccordionContainer>
      <Spacer.Column numberOfSpaces={8} />
      <CookiesSettings {...props} />
      <Spacer.Column numberOfSpaces={8} />
      <Typo.Title4 {...getHeadingAttrs(2)}>Tu as la main dessus</Typo.Title4>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>
        Ton choix est conservé pendant 6 mois et tu pourras le modifier dans les paramètres de
        confidentialité de ton profil à tout moment.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>On te redemandera bien sûr ton consentement si notre politique évolue.</Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.CaptionNeutralInfo>
        {buttonText}
        <Spacer.Row numberOfSpaces={1} />
        <ExternalTouchableLink
          as={ButtonInsideText}
          wording="Politique de gestion des cookies"
          externalNav={{ url: env.COOKIES_POLICY_LINK }}
          icon={ExternalSiteFilled}
          typography="Caption"
        />
      </Typo.CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={8} />
    </React.Fragment>
  )
}

const ACCORDION_BORDER_RADIUS = getSpacing(2)
const StyledAccordionItem = styled(AccordionItem).attrs(({ theme }) => ({
  title: <Typo.ButtonText>Qu’est-ce que les cookies&nbsp;?</Typo.ButtonText>,
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
