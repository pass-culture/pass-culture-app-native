import { useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Linking, Platform } from 'react-native'
import { checkNotifications, PermissionStatus } from 'react-native-permissions'

import { NotificationSubscriptions, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { PushNotificationsModal } from 'features/notifications/pages/PushNotificationsModal'
import { useUpdateProfileMutation } from 'features/profile/api/useUpdateProfileMutation'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { analytics } from 'libs/analytics'
import { useAppStateChange } from 'libs/appState'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Spacer, Typo } from 'ui/theme'

type State = {
  allowEmails: boolean | undefined
  allowPush: boolean | undefined
  pushPermission: PermissionStatus | undefined
  emailTouched: boolean
  pushTouched: boolean
}

export function NotificationSettingsDeprecated() {
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const { isLoggedIn, user } = useAuthContext()

  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  const route = useRoute()
  const [state, setState] = useState<State>({
    allowEmails: undefined,
    allowPush: undefined,
    pushPermission: undefined,
    emailTouched: false,
    pushTouched: false,
  })

  const {
    visible: isNotificationsModalVisible,
    showModal: showNotificationsModal,
    hideModal: hideNotificationsModal,
  } = useModal(false)

  // refresh state on page focus
  useEffect(() => {
    refreshPermissionAndStates(user)
  }, [route.key, user])

  // refresh state when app become active
  useAppStateChange(
    () => refreshPermissionAndStates(user),
    () => void 0,
    [user] // refresh app state listener when the user is changed
  )

  const refreshPermissionAndStates = (newUser: UserProfileResponse | undefined) => {
    checkNotifications().then((permission) => {
      setState({
        pushPermission: permission.status,
        ...getInitialSwitchesState(newUser?.subscriptions),
      })
    })
  }

  const toggleEmails = useCallback(() => {
    if (!isLoggedIn) return
    setState((prevState) => ({
      ...prevState,
      emailTouched: prevState.allowEmails === user?.subscriptions?.marketingEmail,
      allowEmails: !prevState.allowEmails,
    }))
  }, [user, isLoggedIn])

  const togglePush = useCallback(() => {
    if (!isLoggedIn) return
    setState((prevState) => {
      if (prevState.pushPermission !== 'granted') {
        showNotificationsModal()
        return prevState
      }

      return {
        ...prevState,
        pushTouched: prevState.allowPush === user?.subscriptions?.marketingPush,
        allowPush: !prevState.allowPush,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoggedIn])

  const onRequestNotificationPermissionFromModal = () => {
    hideNotificationsModal()
    Linking.openSettings()
  }

  const { mutate: updateProfile, isLoading: isUpdating } = useUpdateProfileMutation(
    () => {
      showSuccessSnackBar({
        message: 'Paramètre enregistré',
        timeout: SNACK_BAR_TIME_OUT,
      })
      analytics.logNotificationToggle(!!state.allowEmails, state.allowPush)

      goBack()
    },
    /**
     * the mutation code already takes care of updating the react-query cache.
     * It also updates the user which triggers the checkNotifications effect
     */
    () => {
      showErrorSnackBar({
        message: 'Une erreur est survenue',
      })
      // on error rollback to the last loaded result

      setState((prevState) => ({
        ...prevState, // keep permission state
        ...getInitialSwitchesState(user?.subscriptions),
      }))
    }
  )

  const submitProfile = () => {
    if (state.allowEmails !== undefined && state.allowPush !== undefined) {
      updateProfile({
        subscriptions: {
          marketingEmail: state.allowEmails,
          marketingPush: state.allowPush,
        },
      })
    }
  }

  const allowEmails = state.allowEmails ?? user?.subscriptions?.marketingEmail ?? isLoggedIn
  const pushSwitchEnabled = Boolean(state.pushPermission === 'granted' && state.allowPush)

  return (
    <SecondaryPageWithBlurHeader title="Notifications">
      <Typo.Body>
        {isLoggedIn
          ? 'Reste informé des actualités du pass Culture et ne rate aucun de nos bons plans.'
          : 'Tu dois être connecté pour activer les notifications et rester informé des actualités du pass Culture '}
      </Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <Separator.Horizontal />
      <Spacer.Column numberOfSpaces={4} />
      <Typo.CaptionNeutralInfo>
        Je veux recevoir les recommandations personnalisées et meilleures offres du pass Culture.
      </Typo.CaptionNeutralInfo>
      <Form.Flex>
        <Spacer.Column numberOfSpaces={4} />
        <SectionWithSwitch
          title="Autoriser l’envoi d’e-mails"
          active={allowEmails}
          toggle={toggleEmails}
          disabled={!isLoggedIn}
        />
        <Spacer.Column numberOfSpaces={4} />

        {Platform.OS !== 'web' && (
          <React.Fragment>
            <Separator.Horizontal />
            <Spacer.Column numberOfSpaces={4} />
            <Typo.CaptionNeutralInfo>
              Je veux être alerté des actualités et des meilleures offres du pass Culture
              directement sur mon appareil.
            </Typo.CaptionNeutralInfo>
            <Spacer.Column numberOfSpaces={4} />
            <SectionWithSwitch
              title="Autoriser les notifications marketing"
              active={pushSwitchEnabled}
              toggle={togglePush}
              disabled={!isLoggedIn}
            />
            <Spacer.Column numberOfSpaces={4} />
          </React.Fragment>
        )}
        {!!isLoggedIn && (
          <React.Fragment>
            <Spacer.Flex />
            <ButtonPrimary
              wording="Enregistrer"
              accessibilityLabel="Enregistrer les modifications"
              isLoading={isUpdating}
              disabled={!state.emailTouched && !state.pushTouched}
              onPress={submitProfile}
              center
            />
            <Spacer.BottomScreen />
          </React.Fragment>
        )}
      </Form.Flex>
      <PushNotificationsModal
        visible={isNotificationsModalVisible}
        onRequestPermission={onRequestNotificationPermissionFromModal}
        onDismiss={hideNotificationsModal}
      />
    </SecondaryPageWithBlurHeader>
  )
}

const getInitialSwitchesState = (
  subscriptions?: NotificationSubscriptions
): Omit<State, 'pushPermission'> => {
  const { marketingEmail, marketingPush } = subscriptions ?? {}

  return {
    allowEmails: Boolean(marketingEmail),
    allowPush: Boolean(marketingPush),
    emailTouched: false,
    pushTouched: false,
  }
}
