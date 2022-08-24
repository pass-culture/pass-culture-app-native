import { t } from '@lingui/macro'
import React from 'react'

import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { PageProfileSection } from 'features/profile/pages/PageProfileSection/PageProfileSection'
import { env } from 'libs/environment'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const NewConsentSettings = () => (
  <PageProfileSection title={t`Paramètres de confidentialité`} scrollable>
    <Typo.Body>
      {t`L’application pass Culture utilise des outils et traceurs appelés cookies pour améliorer ton expérience de navigation.`}
    </Typo.Body>
    <Spacer.Column numberOfSpaces={4} />
    <GreyDarkCaption>
      {t`Tu peux choisir d’accepter ou non l’activation de leur suivi.`}
    </GreyDarkCaption>
    <Spacer.Column numberOfSpaces={8} />
    <CookiesSettings />
    <Spacer.Column numberOfSpaces={4} />
    <Typo.Title4 {...getHeadingAttrs(2)}>{t`Tu as la main dessus`}</Typo.Title4>
    <Spacer.Column numberOfSpaces={4} />
    <Typo.Body>
      {t`Ton choix est enregistré pour 6 mois et tu peux changer d’avis à tout moment.`}
    </Typo.Body>
    <Spacer.Column numberOfSpaces={4} />
    <Typo.Body>
      {t`On te redemandera bien sûr ton consentement si notre politique évolue.`}
    </Typo.Body>
    <Spacer.Column numberOfSpaces={4} />
    <GreyDarkCaption>
      {t`Pour plus d’informations, nous t’invitons à consulter notre`}
      <Spacer.Row numberOfSpaces={1} />
      <TouchableLink
        as={ButtonInsideText}
        wording={t`Politique de gestion des cookies`}
        externalNav={{ url: env.COOKIES_POLICY_LINK }}
        icon={ExternalSiteFilled}
        typography="Caption"
      />
    </GreyDarkCaption>
    <Spacer.Column numberOfSpaces={8} />
    <ButtonPrimary
      wording={t`Enregistrer mes choix`}
      onPress={() => alert('ce bouton sera fonctionnel avec PC-16598')}
      center
    />
    <Spacer.Column numberOfSpaces={4} />
  </PageProfileSection>
)
