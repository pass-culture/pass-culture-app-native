import React, { FunctionComponent } from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { env } from 'libs/environment/env'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Close } from 'ui/svg/icons/Close'
import { TypoDS } from 'ui/theme'

type Props = {
  isVisible: boolean
  closeModal: VoidFunction
}

export const ChroniclesWritersModal: FunctionComponent<Props> = ({ isVisible, closeModal }) => {
  return (
    <AppModal
      visible={isVisible}
      title="Qui écrit les avis&nbsp;?"
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={closeModal}>
      <ViewGap gap={6}>
        <TypoDS.Body>
          Les avis du book club sont écrits par des jeunes passionnés de lecture.
        </TypoDS.Body>
        <TypoDS.Body>
          Ils sont sélectionnés par le pass Culture pour te faire leurs meilleures recos tous les
          mois.
        </TypoDS.Body>
        <InternalTouchableLink
          as={ButtonPrimary}
          wording="Voir toutes les recos du book club"
          navigateTo={
            env.ENV === 'production'
              ? {
                  screen: 'ThematicHome',
                  params: {
                    homeId: '4mlVpAZySUZO6eHazWKZeV',
                    from: 'chronicles',
                  },
                }
              : navigateToHomeConfig
          }
          onBeforeNavigate={closeModal}
        />
      </ViewGap>
    </AppModal>
  )
}
