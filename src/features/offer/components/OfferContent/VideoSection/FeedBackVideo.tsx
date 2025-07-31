import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import styled from 'styled-components/native'

import { ReactionTypeEnum, SubcategoryIdEnum } from 'api/gen'
import { MAX_WIDTH_VIDEO } from 'features/offer/constant'
import { ReactionChoiceValidation } from 'features/reactions/components/ReactionChoiceValidation/ReactionChoiceValidation'
import { ReactionFromEnum } from 'features/reactions/enum'
import { analytics } from 'libs/analytics/provider'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

const getStorageKey = (offerId: number) => `feedback_reaction_${offerId}`

type Props = {
  offerId: number
  offerSubcategory: SubcategoryIdEnum
  userId?: number
}

export function FeedBackVideo({ offerId, offerSubcategory, userId }: Props) {
  const [reaction, setReaction] = useState<ReactionTypeEnum | null>(null)
  const [hasJustReacted, setHasJustReacted] = useState(false)

  // Use stored reaction to prevent reshowing the buttons and
  // If app is killed and relaunched, reaction is still stored but "thank you" message is not shown.
  useEffect(() => {
    const fetchReaction = async () => {
      const saved = await AsyncStorage.getItem(getStorageKey(offerId))

      if (saved === ReactionTypeEnum.LIKE || saved === ReactionTypeEnum.DISLIKE) {
        setReaction(saved)
      } else {
        setReaction(null)
      }
    }
    fetchReaction()
  }, [offerId])

  // When user reacts, store the reaction and show the questionnaire invitation immediately.
  const handleReaction = useCallback(
    async (type: ReactionTypeEnum) => {
      if (type !== ReactionTypeEnum.LIKE && type !== ReactionTypeEnum.DISLIKE) return

      analytics.logValidateReaction({
        offerId,
        reactionType: type,
        from: ReactionFromEnum.OFFER_VIDEO_SURVEY,
        userId,
      })

      setReaction(type)
      setHasJustReacted(true)
      await AsyncStorage.setItem(getStorageKey(offerId), type)
    },
    [offerId, userId]
  )

  // When navigating away from the screen, hide the questionnaire invitation.
  useFocusEffect(
    useCallback(() => {
      return () => {
        setHasJustReacted(false)
      }
    }, [])
  )

  // When app goes to background, hide the questionnaire invitation.
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState !== 'active') {
        setHasJustReacted(false)
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => subscription.remove()
  }, [])

  const url =
    reaction === ReactionTypeEnum.LIKE
      ? `https://passculture.qualtrics.com/jfe/form/SV_238Dd248lT6UuJE?subcategory=${offerSubcategory}`
      : `https://passculture.qualtrics.com/jfe/form/SV_3lb1IPodkGiMzWe?subcategory=${offerSubcategory}`

  if (reaction && hasJustReacted) {
    return (
      <Container gap={2}>
        <Typo.BodyAccent>
          Merci pour ta réponse&nbsp;! As-tu 2 minutes pour nous dire pourquoi&nbsp;?
        </Typo.BodyAccent>
        <ExternalTouchableLink
          wording="Répondre au court questionnaire"
          as={ButtonInsideTextPrimary}
          externalNav={{ url }}
          typography="BodyAccentXs"
          icon={ExternalSiteFilled}
        />
      </Container>
    )
  }

  if (!reaction) {
    return (
      <Container gap={3}>
        <Typo.BodyAccent>Trouves-tu le contenu de cette vidéo utile&nbsp;?</Typo.BodyAccent>
        <ReactionChoiceValidation
          reactionStatus={null}
          handleOnPressReactionButton={handleReaction}
          likeLabel="Oui"
          dislikeLabel="Non"
        />
      </Container>
    )
  }

  return null
}

const Container = styled(ViewGap)({
  maxWidth: MAX_WIDTH_VIDEO,
})

const ButtonInsideTextPrimary = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.designSystem.color.text.brandPrimary,
}))``
