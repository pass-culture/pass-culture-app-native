import { StackActions, useNavigation, useRoute } from '@react-navigation/native'
import React, { FC, useCallback } from 'react'
import { Linking } from 'react-native'

import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getSurveyConfigFromActivity } from 'features/venue/helpers/getSurveyConfigFromActivity'
import { markVenueSurveyAccess } from 'features/venue/helpers/venueSurveyAccessStorage'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { ModalSimple } from 'ui/designSystem/ModalSimple/ModalSimple'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

export const VenueSurveyModal: FC = () => {
  const { params } = useRoute<UseRouteType<'VenueSurveyModal'>>()
  const { activity } = params
  const { goBack, getState, dispatch } = useNavigation<UseNavigationType>()

  const surveyConfig = getSurveyConfigFromActivity(activity)

  const handleOnClose = useCallback(async () => {
    if (surveyConfig) {
      await markVenueSurveyAccess(surveyConfig.key)
    }

    const state = getState()
    if (state.routes.length >= 3) {
      dispatch(StackActions.pop(2))
    } else {
      goBack()
    }
  }, [dispatch, getState, goBack, surveyConfig])

  const handleOpenSurvey = useCallback(async () => {
    const surveyUrl = getSurveyConfigFromActivity(activity)?.url

    if (surveyUrl) {
      await Linking.openURL(surveyUrl)
    }

    await handleOnClose()
  }, [activity, handleOnClose])

  if (!surveyConfig) return null

  return (
    <ModalSimple
      onClose={handleOnClose}
      title="Avant de partir..."
      description={`Aide-nous à améliorer ton expérience ${surveyConfig?.descriptionEnd} en répondant à ce court questionnaire (temps estimé\u00a0: 2\u00a0min).`}
      illustration={{ backgroundColor: 'positive01', url: remoteIllustrationUrls.oldMegaphone }}
      primaryButton={{
        wording: 'Donner mon avis',
        accessibilityLabel: 'Donner mon avis',
        onPress: handleOpenSurvey,
        icon: ExternalSiteFilled,
      }}
    />
  )
}
