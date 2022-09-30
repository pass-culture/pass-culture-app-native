import React, { useEffect } from 'react'
import { Platform } from 'react-native'

import { navigateToHome } from 'features/navigation/helpers'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { shareApp } from 'libs/share/shareApp/shareApp'
import { shareAppContent } from 'libs/share/shareApp/shareAppContent'
import { WebShareModal } from 'libs/share/WebShareModal'
import { useModal } from 'ui/components/modals/useModal'
import { Background } from 'ui/svg/Background'

export const ShareAppModal = () => {
  const { goBack } = useGoBack(...homeNavConfig)
  const { visible, hideModal } = useModal(true)

  useEffect(() => {
    if (Platform.OS !== 'web') {
      shareApp().then(goBack)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (Platform.OS === 'web') {
    return (
      <React.Fragment>
        <Background />
        <WebShareModal
          visible={visible}
          headerTitle="Partage le lien d’invitation"
          shareContent={shareAppContent}
          dismissModal={() => {
            navigateToHome()
            hideModal()
          }}
        />
      </React.Fragment>
    )
  }

  return <Background />
}
