import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { PageProfileSection } from 'features/profile/pages/PageProfileSection/PageProfileSection'
import { env } from 'libs/environment'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'

export const NewConsentSettings = () => (
  <PageProfileSection title={t`Paramètres de confidentialité`} scrollable>
    <Typo.Body>
      {t`L’application pass Culture utilise des outils et traceurs appelés cookies pour améliorer ton expérience de navigation.`}
    </Typo.Body>
    <Spacer.Column numberOfSpaces={4} />
    <StyledCaption>
      {t`Tu peux choisir d’accepter ou non l’activation de leur suivi.`}
    </StyledCaption>
    <Spacer.Column numberOfSpaces={8} />
    <CookiesSettings />
    <Spacer.Column numberOfSpaces={4} />
    <Typo.Title4>{t`Tu as la main dessus`}</Typo.Title4>
    <Spacer.Column numberOfSpaces={4} />
    <Typo.Body>
      {t`Ton choix est enregistré pour 6 mois et tu peux changer d’avis à tout moment.`}
    </Typo.Body>
    <Spacer.Column numberOfSpaces={4} />
    <Typo.Body>
      {t`On te redemandera bien sûr ton consentement si notre politique évolue.`}
    </Typo.Body>
    <Spacer.Column numberOfSpaces={4} />
    <StyledCaption>
      {t`Pour plus d’informations, nous t’invitons à consulter notre`}
      <Spacer.Row numberOfSpaces={1} />
      <TouchableLink
        as={ButtonInsideText}
        wording={t`Politique de gestion des cookies`}
        externalNav={{ url: env.COOKIES_POLICY_LINK }}
        icon={ExternalSiteFilled}
        typography="Caption"
      />
    </StyledCaption>
    <Spacer.Column numberOfSpaces={8} />
    <ButtonPrimary wording={t`Enregistrer mes choix`} onPress={() => null} center />
    <Spacer.Column numberOfSpaces={4} />
  </PageProfileSection>
)

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
