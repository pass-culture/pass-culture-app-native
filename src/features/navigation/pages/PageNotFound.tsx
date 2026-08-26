import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Page } from 'ui/pages/Page'
import { PageNotFound as PageNotFoundIcon } from 'ui/svg/icons/PageNotFound'

export const PageNotFound: React.FC = () => (
  <Page>
    <GenericInfoPage
      illustration={PageNotFoundIcon}
      remoteIllustration={{
        url: remoteIllustrationUrls.emptyDigitalWindowLarge,
        backgroundColor: 'pending01',
      }}
      title="Page introuvable&nbsp;!"
      subtitle="Il est possible que cette page soit désactivée ou n’existe pas."
      buttonPrimary={{
        wording: 'Retourner à l’accueil',
        navigateTo: navigateToHomeConfig,
      }}
    />
  </Page>
)
