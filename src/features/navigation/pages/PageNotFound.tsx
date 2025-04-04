import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { Helmet } from 'libs/react-helmet/Helmet'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Page } from 'ui/pages/Page'
import { PageNotFound as PageNotFoundIcon } from 'ui/svg/icons/PageNotFound'

export const PageNotFound: React.FC = () => {
  const helmetTitle = 'Page introuvable | pass Culture'
  return (
    <Page>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>
      <GenericInfoPage
        illustration={PageNotFoundIcon}
        title="Page introuvable&nbsp;!"
        subtitle="Il est possible que cette page soit désactivée ou n’existe pas."
        buttonPrimary={{
          wording: 'Retourner à l’accueil',
          navigateTo: navigateToHomeConfig,
        }}
      />
    </Page>
  )
}
