import { t } from '@lingui/macro'
import React, { useEffect } from 'react'
import { Platform, Modal } from 'react-native'

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
      goBack()
      shareApp()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (Platform.OS === 'web') {
    return (
      <React.Fragment>
        <Background />
        <WebShareModal
          visible={visible}
          headerTitle={t`Partage le lien d’invitation`}
          shareContent={shareAppContent}
          dismissModal={() => {
            navigateToHome()
            hideModal()
          }}
        />
      </React.Fragment>
    )
  }

  if (Platform.OS === 'ios') {
    // Hack to show the native share modal on the page the user is currently on
    return <Modal visible={true} />
  }

  return <Background />
}
