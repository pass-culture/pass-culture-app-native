import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Platform } from 'react-native'
import { checkNotifications, PermissionStatus } from 'react-native-permissions'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import FilterSwitch from 'ui/components/FilterSwitch'
import { PageHeader } from 'ui/components/headers/PageHeader'
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
  const [state, setState] = useState<State>({
    allowEmails: undefined,
    pushPermission: 'unavailable',
    pushSwitchEnabled: false,
    emailTouched: false,
    pushTouched: false,
  })

  const { data: user } = useUserProfileInfo()

  useFocusEffect(
    useCallback(() => {
      checkNotifications().then((permission) => {
        const { marketing_email, marketing_push } = user?.subscriptions || {}

        // save values for treatments
        setState({
          allowEmails: marketing_email ?? true,
          pushPermission: permission.status,
          pushSwitchEnabled: permission.status === 'granted' && Boolean(marketing_push),
          emailTouched: false,
          pushTouched: false,
        })
      })
    }, [])
  )

  const toggleEmails = useCallback(
    () =>
      setState((prevState) => ({
        ...prevState,
        emailTouched: prevState.allowEmails === user?.subscriptions?.marketing_email,
        allowEmails: !prevState.allowEmails,
      })),
    []
  )
  const togglePush = useCallback(
    () =>
      setState((prevState) => ({
        ...prevState,
        pushTouched: prevState.pushSwitchEnabled === user?.subscriptions?.marketing_push,
        pushSwitchEnabled: !prevState.pushSwitchEnabled,
      })),
    []
  )

  const allowEmails = state.allowEmails ?? user?.subscriptions.marketing_email ?? true

  const { mutate: updateProfile } = useUpdateProfileMutation(
    (response) => {
      setState((prevState) => ({
        ...prevState,
        emailTouched: false,
        pushTouched: false,
        allowEmails: response?.subscriptions?.marketing_email,
        pushSwitchEnabled:
          state.pushPermission === 'granted' && Boolean(response?.subscriptions?.marketing_push),
      }))
    },
    () => {
      // next commit
    }
  )

  const submitProfile = () => {
    if (state.allowEmails !== undefined && state.allowEmails !== undefined) {
      updateProfile({
        subscriptions: {
          marketing_email: state.allowEmails ?? false,
          marketing_push: state.pushSwitchEnabled,
        },
      })
    }
  }

  return (
    <React.Fragment>
      <PageHeader title={_(t`Notifications`)} />
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
            title={_(t`Autoriser l’envoi d’e-mails`)}
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
          disabled={!state.emailTouched && !state.pushTouched}
          onPress={submitProfile}
        />
        <Spacer.Column numberOfSpaces={8} />
      </ProfileContainer>
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
