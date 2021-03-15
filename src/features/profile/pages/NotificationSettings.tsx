import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Linking, Platform } from 'react-native'
import { checkNotifications, PermissionStatus } from 'react-native-permissions'
import styled from 'styled-components/native'

import { NotificationSubscriptions, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { useAppStateChange } from 'libs/appState'
import { _ } from 'libs/i18n'
import { PushNotificationsModal } from 'libs/notifications/components/PushNotificationsModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import FilterSwitch from 'ui/components/FilterSwitch'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { useModal } from 'ui/components/modals/useModal'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { useUpdateProfileMutation } from '../api'
import { ProfileContainer, Separator } from '../components/reusables'
import { SectionRow } from '../components/SectionRow'

type State = {
  allowEmails: boolean | undefined
  allowPush: boolean | undefined
  pushPermission: PermissionStatus | undefined
  emailTouched: boolean
  pushTouched: boolean
}

export function NotificationSettings() {
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const { isLoggedIn } = useAuthContext()

  const { goBack } = useNavigation()

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

  const { data: user } = useUserProfileInfo()

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
    if (!isLoggedIn) {
      return
    }
    setState((prevState) => ({
      ...prevState,
      emailTouched: prevState.allowEmails === user?.subscriptions?.marketingEmail,
      allowEmails: !prevState.allowEmails,
    }))
  }, [user, isLoggedIn])
  const togglePush = useCallback(() => {
    if (!isLoggedIn) {
      return
    }
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
  }, [user, isLoggedIn])

  const onRequestNotificationPermissionFromModal = () => {
    hideNotificationsModal()
    Linking.openSettings()
  }

  const { mutate: updateProfile, isLoading: isUpdating } = useUpdateProfileMutation(
    () => {
      showSuccessSnackBar({
        message: _(t`Le réglage est sauvegardé`),
        timeout: 5000,
      })
      goBack()
    },
    /**
     * the mutation code already takes care of updating the react-query cache.
     * It also updates the user which triggers the checkNotifications effect
     */
    () => {
      showErrorSnackBar({
        message: _(t`Une erreur est survenue`),
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

  const allowEmails = state.allowEmails ?? user?.subscriptions?.marketingEmail ?? true
  const pushSwitchEnabled = Boolean(state.pushPermission === 'granted' && state.allowPush)

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={18} />
      <ProfileContainer>
        <Typo.Body color={ColorsEnum.BLACK}>
          {isLoggedIn
            ? _(t`Reste informé des actualités du pass Culture et ne rate aucun de nos bons plans.`)
            : _(
                t`Tu dois être connecté pour activer les notifications et rester informé des actualités du pass Culture `
              )}
        </Typo.Body>
        <Spacer.Column numberOfSpaces={4} />
        <Separator />
        <Line>
          <SettingExplanation>
            {_(
              t`Je veux recevoir les actualités et les meilleures offres du pass Culture par e\u2011mail.`
            )}
          </SettingExplanation>
          <Spacer.Column numberOfSpaces={4} />
          <SectionRow
            type="clickable"
            title={_(t`Autoriser l’envoi d’e\u2011mails`)}
            cta={<FilterSwitch testID="email" active={allowEmails} toggle={toggleEmails} />}
          />
          <Spacer.Column numberOfSpaces={3} />
        </Line>
        <Separator />
        {Platform.OS === 'ios' && (
          <React.Fragment>
            <Line>
              <SettingExplanation>
                {_(
                  t`Je veux être alerté des actualités et des meilleures offres du pass Culture directement sur mon appareil.`
                )}
              </SettingExplanation>
              <Spacer.Column numberOfSpaces={4} />
              <SectionRow
                type="clickable"
                title={_(t`Autoriser les notifications marketing`)}
                cta={<FilterSwitch testID="push" active={pushSwitchEnabled} toggle={togglePush} />}
              />
              <Spacer.Column numberOfSpaces={3} />
            </Line>
          </React.Fragment>
        )}
        <Spacer.Flex flex={1} />
        {isLoggedIn && (
          <ButtonPrimary
            title={_(t`Enregistrer`)}
            isLoading={isUpdating}
            disabled={!state.emailTouched && !state.pushTouched}
            onPress={submitProfile}
          />
        )}
        <Spacer.Column numberOfSpaces={8} />
      </ProfileContainer>
      <PageHeader title={_(t`Notifications`)} />
      <PushNotificationsModal
        visible={isNotificationsModalVisible}
        onRequestPermission={onRequestNotificationPermissionFromModal}
        onDismiss={hideNotificationsModal}
      />
    </React.Fragment>
  )
}

const Line = styled.View({
  paddingVertical: getSpacing(4),
})

const SettingExplanation = styled.Text({
  fontFamily: 'Montserrat-Medium',
  fontSize: 13,
  lineHeight: '16px',
  color: ColorsEnum.GREY_DARK,
})

const getInitialSwitchesState = (
  subscriptions?: NotificationSubscriptions
): Omit<State, 'pushPermission'> => {
  const { marketingEmail, marketingPush } = subscriptions || {}

  return {
    allowEmails: Boolean(marketingEmail),
    allowPush: Boolean(marketingPush),
    emailTouched: false,
    pushTouched: false,
  }
}
