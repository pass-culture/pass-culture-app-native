import React, { FunctionComponent } from 'react'
import { Platform, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { SubscribeButton } from 'features/home/components/SubscribeButton'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { useThematicSubscription } from 'features/subscription/helpers/useThematicSubscription'
import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { SubscriptionTheme } from 'features/subscription/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing } from 'ui/theme'

export const ThematicHomeWithSubscribeCheatcode: FunctionComponent = () => {
  const { headerTransition, onScroll } = useOpacityTransition()
  const { user } = useAuthContext()

  const theme = SubscriptionTheme.CINEMA

  const {
    isSubscribeButtonActive,
    isAtLeastOneNotificationTypeActivated,
    updateSubscription,
    updateSettings,
  } = useThematicSubscription({
    user,
    theme,
  })

  const { visible, showModal, hideModal } = useModal(false)

  return (
    <Container>
      <ThematicHomeHeader
        headerTransition={headerTransition}
        title={mapSubscriptionThemeToName[theme]}
      />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <CategoryThematicHomeHeader
          imageUrl="https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg"
          subtitle="Un sous-titre"
          title={mapSubscriptionThemeToName[theme]}
        />
        <SubscribeButtonContainer>
          <SubscribeButton
            active={isSubscribeButtonActive || false}
            onPress={() => {
              if (
                (Platform.OS === 'web' && !user?.subscriptions.marketingEmail) ||
                (Platform.OS !== 'web' && !isAtLeastOneNotificationTypeActivated)
              ) {
                showModal()
              } else {
                updateSubscription()
              }
            }}
          />
        </SubscribeButtonContainer>
        <BodyPlaceholder />
      </ScrollView>
      <NotificationsSettingsModal
        visible={visible}
        dismissModal={hideModal}
        theme={theme}
        onPressSaveChanges={(settings) => {
          updateSettings(settings)
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
