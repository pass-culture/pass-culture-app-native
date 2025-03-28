import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { Helmet } from 'libs/react-helmet/Helmet'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { PageNotFound as PageNotFoundIcon } from 'ui/svg/icons/PageNotFound'

export const PageNotFound: React.FC = () => {
  const helmetTitle = 'Page introuvable | pass Culture'
  return (
    <React.Fragment>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>
      <GenericInfoPageWhite
        illustration={PageNotFoundIcon}
        title="Page introuvable&nbsp;!"
        subtitle="Il est possible que cette page soit désactivée ou n’existe pas."
        buttonPrimary={{
          wording: 'Retourner à l’accueil',
          navigateTo: navigateToHomeConfig,
        }}
      />
    </React.Fragment>
  )
}
