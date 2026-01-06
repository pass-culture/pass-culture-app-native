import React from 'react'

import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'
import { LINE_BREAK, SECTION_ROW_ICON_SIZE, SPACE } from 'ui/theme/constants'

export function LegalNotices() {
  const { goBack } = useGoBack(...getTabHookConfig('Profile'))

  return (
    <SecondaryPageWithBlurHeader title="Informations légales" onGoBack={goBack} scrollable>
      <ViewGap gap={4}>
        <Typo.Body>ÉDITEUR SAS pass Culture</Typo.Body>
        <Typo.Body>
          Éditeur du site&nbsp;:
          {SPACE}
          <ExternalTouchableLink
            as={LinkInsideText}
            wording="https://passculture.app/accueil"
            externalNav={{ url: 'https://passculture.app/accueil' }}
            icon={ExternalSiteFilled}
            accessibilityRole={AccessibilityRole.LINK}
          />
        </Typo.Body>
        {/* eslint-disable-next-line local-rules/no-euro-usage */}
        <Typo.Body>
          Société par actions simplifiée au capital de 1&nbsp;000&nbsp;000&nbsp;€
        </Typo.Body>
        <Typo.Body>Siège social&nbsp;: 35 Boulevard de Sébastopol – 75001 Paris - France</Typo.Body>
        <Typo.Body>
          Immatriculée au RCS de Paris sous le numéro&nbsp;: 853&nbsp;318&nbsp;459
        </Typo.Body>
        <Typo.Body>N° TVA intracommunautaire&nbsp;: FR65853318459</Typo.Body>
        <Typo.Body>Directrice de la publication&nbsp;: Laurence Tison-Vuillaume</Typo.Body>
        <Typo.Body>
          Hébergeur&nbsp;: Google Cloud Platform
          {LINE_BREAK}8 Rue de Londres - 75009 Paris - France
        </Typo.Body>
        <Typo.Body>
          <ExternalTouchableLink
            as={LinkInsideText}
            wording="Contacter le support"
            externalNav={{ url: env.SUPPORT_ACCOUNT_ISSUES_FORM }}
            accessibilityRole={AccessibilityRole.LINK}
            onBeforeNavigate={() => analytics.logHasClickedContactForm('LegalNotices')}
          />
        </Typo.Body>

        <Separator.Horizontal />

        <SectionRow
          title="Conditions Générales d’Utilisation"
          type="clickable"
          externalNav={{ url: env.CGU_LINK }}
          icon={ExternalSite}
          iconSize={SECTION_ROW_ICON_SIZE}
        />

        <Separator.Horizontal />

        <SectionRow
          title="Charte de protection des données personnelles"
          type="clickable"
          externalNav={{ url: env.PRIVACY_POLICY_LINK }}
          icon={ExternalSite}
          iconSize={SECTION_ROW_ICON_SIZE}
        />
      </ViewGap>
    </SecondaryPageWithBlurHeader>
  )
}
