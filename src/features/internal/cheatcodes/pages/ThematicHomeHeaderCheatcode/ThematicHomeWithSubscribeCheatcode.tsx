import React, { FunctionComponent, useState } from 'react'
import { ScrollView } from 'react-native'
import { PermissionStatus } from 'react-native-permissions'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { SubscribeButton } from 'features/home/components/SubscribeButton'
import { usePushPermission } from 'features/profile/pages/NotificationSettings/usePushPermission'
import { mapSubscriptionThemeToName } from 'features/subscription/mapSubscriptionThemeToName'
import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { SubscriptionTheme } from 'features/subscription/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing } from 'ui/theme'

export const ThematicHomeWithSubscribeCheatcode: FunctionComponent = () => {
  const { headerTransition, onScroll } = useOpacityTransition()
  const { user } = useAuthContext()
  const [isPushPermissionGranted, setIsPushPermissionGranted] = useState<boolean | undefined>(
    undefined
  )
  usePushPermission((permission: PermissionStatus) =>
    setIsPushPermissionGranted(permission === 'granted')
  )
  const { visible, showModal, hideModal } = useModal(false)
  return (
    <Container>
      <ThematicHomeHeader
        headerTransition={headerTransition}
        title={mapSubscriptionThemeToName[SubscriptionTheme.CINEMA]}
      />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <CategoryThematicHomeHeader
          imageUrl="https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg"
          subtitle="Un sous-titre"
          title={mapSubscriptionThemeToName[SubscriptionTheme.CINEMA]}
        />
        <SubscribeButtonContainer>
          <SubscribeButton
            active={false}
            onPress={() => {
              if (!isPushPermissionGranted && !user?.subscriptions.marketingEmail) {
                showModal()
              }
            }}
          />
        </SubscribeButtonContainer>
        <BodyPlaceholder />
      </ScrollView>
      <NotificationsSettingsModal
        visible={visible}
        dismissModal={hideModal}
        theme={SubscriptionTheme.CINEMA}
        onPressSaveChanges={() => {
          return
        }}
      />
    </Container>
  )
}

const Container = styled.View({
  width: '100%',
  height: '100%',
})

const SubscribeButtonContainer = styled.View({
  position: 'absolute',
  right: getSpacing(2.5),
  top: getSpacing(40),
})

const BodyPlaceholder = styled.View(({ theme }) => ({
  height: getSpacing(250),
  backgroundColor: theme.colors.aquamarine,
}))
