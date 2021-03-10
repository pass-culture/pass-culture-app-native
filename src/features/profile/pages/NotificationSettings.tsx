import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { checkNotifications, PermissionStatus } from 'react-native-permissions'
import styled from 'styled-components/native'

import { NotificationSubscriptions } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import FilterSwitch from 'ui/components/FilterSwitch'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { useUpdateProfileMutation } from '../api'
import { ProfileContainer, Separator } from '../components/reusables'
import { SectionRow } from '../components/SectionRow'

type State = {
  allowEmails: boolean | undefined
  pushPermission: PermissionStatus
  pushSwitchEnabled: boolean
  emailTouched: boolean
  pushTouched: boolean
}

export function NotificationSettings() {
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const route = useRoute()
  const [state, setState] = useState<State>({
    allowEmails: undefined,
    pushPermission: 'unavailable',
    pushSwitchEnabled: false,
    emailTouched: false,
    pushTouched: false,
  })

  const { data: user } = useUserProfileInfo()

  // refresh state on page focus
  useEffect(() => {
    checkNotifications().then((permission) => {
      setState({
        pushPermission: permission.status,
        ...getInitialSwitchesState(permission.status, user?.subscriptions),
      })
    })
  }, [route.key, user])

  const toggleEmails = useCallback(
    () =>
      setState((prevState) => ({
        ...prevState,
        emailTouched: prevState.allowEmails === user?.subscriptions?.marketingEmail,
        allowEmails: !prevState.allowEmails,
      })),
    [user]
  )
  const togglePush = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      pushTouched: prevState.pushSwitchEnabled === user?.subscriptions?.marketingPush,
      pushSwitchEnabled: !prevState.pushSwitchEnabled,
    }))
  }, [user])

  const allowEmails = state.allowEmails ?? user?.subscriptions?.marketingEmail ?? true

  const { mutate: updateProfile, isLoading: isUpdating } = useUpdateProfileMutation(
    () => {
      showSuccessSnackBar({
        message: _(t`Le réglage est sauvegardé`),
        timeout: 5000,
      })
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
        ...getInitialSwitchesState(prevState.pushPermission, user?.subscriptions),
      }))
    }
  )

  const submitProfile = () => {
    if (state.allowEmails !== undefined && state.pushSwitchEnabled !== undefined) {
      updateProfile({
        subscriptions: {
          marketingEmail: state.allowEmails ?? false,
          marketingPush: state.pushSwitchEnabled,
        },
      })
    }
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={18} />
      <ProfileContainer>
        <Typo.Body color={ColorsEnum.BLACK}>
          {_(t`Reste informé des actualités du pass Culture et ne rate aucun de nos bons plans.`)}
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
                cta={
                  <FilterSwitch
                    testID="push"
                    active={state.pushSwitchEnabled}
                    toggle={togglePush}
                  />
                }
              />
              <Spacer.Column numberOfSpaces={3} />
            </Line>
          </React.Fragment>
        )}
        <Spacer.Flex flex={1} />
        <ButtonPrimary
          title={_(t`Enregistrer`)}
          isLoading={isUpdating}
          disabled={!state.emailTouched && !state.pushTouched}
          onPress={submitProfile}
        />
        <Spacer.Column numberOfSpaces={8} />
      </ProfileContainer>

      <PageHeader title={_(t`Notifications`)} />
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
  permission: PermissionStatus,
  subscriptions?: NotificationSubscriptions
): Omit<State, 'pushPermission'> => {
  const { marketingEmail, marketingPush } = subscriptions || {}

  return {
    allowEmails: Boolean(marketingEmail),
    pushSwitchEnabled: permission === 'granted' && Boolean(marketingPush),
    emailTouched: false,
    pushTouched: false,
  }
}
