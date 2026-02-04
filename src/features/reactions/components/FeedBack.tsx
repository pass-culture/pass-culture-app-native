import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

import { ReactionTypeEnum } from 'api/gen'
import { ReactionChoiceValidation } from 'features/reactions/components/ReactionChoiceValidation/ReactionChoiceValidation'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

type Props = {
  storageKey: string
  likeQuiz: string
  dislikeQuiz: string
  title: string
  onLogReaction: (type: ReactionTypeEnum) => void
  buttonsLabels?: { like: string; dislike: string }
  thanksMessage?: string
  ctaWording?: string
}

export function FeedBack({
  storageKey,
  likeQuiz,
  dislikeQuiz,
  title,
  onLogReaction,
  buttonsLabels = { like: 'Oui', dislike: 'Non' },
  thanksMessage = 'Merci pour ta réponse\u00a0! As-tu 2 minutes pour nous dire pourquoi\u00a0?',
  ctaWording = 'Répondre au court questionnaire',
}: Props) {
  const [reaction, setReaction] = useState<ReactionTypeEnum | null>(null)
  const [hasJustReacted, setHasJustReacted] = useState(false)

  // Use stored reaction to prevent reshowing the buttons and
  // If app is killed and relaunched, reaction is still stored but "thank you" message is not shown.
  useEffect(() => {
    const fetchReaction = async () => {
      const saved = await AsyncStorage.getItem(storageKey)

      if (saved === ReactionTypeEnum.LIKE || saved === ReactionTypeEnum.DISLIKE) {
        setReaction(saved)
      } else {
        setReaction(null)
      }
    }
    void fetchReaction()
  }, [storageKey])

  // When user reacts, store the reaction and show the questionnaire invitation immediately.
  const handleReaction = useCallback(
    async (type: ReactionTypeEnum) => {
      if (type !== ReactionTypeEnum.LIKE && type !== ReactionTypeEnum.DISLIKE) return

      onLogReaction(type)

      setReaction(type)
      setHasJustReacted(true)
      await AsyncStorage.setItem(storageKey, type)
    },
    [storageKey, onLogReaction]
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

  const url = reaction === ReactionTypeEnum.LIKE ? likeQuiz : dislikeQuiz

  if (reaction && hasJustReacted) {
    return (
      <ViewGap gap={2}>
        <Typo.BodyAccent>{thanksMessage}</Typo.BodyAccent>
        <ExternalTouchableLink
          wording={ctaWording}
          as={LinkInsideText}
          externalNav={{ url }}
          typography="BodyAccentXs"
          accessibilityRole={AccessibilityRole.LINK}
        />
      </ViewGap>
    )
  }

  if (!reaction) {
    return (
      <ViewGap gap={3}>
        <Typo.BodyAccent>{title}</Typo.BodyAccent>
        <ReactionChoiceValidation
          reactionStatus={null}
          handleOnPressReactionButton={handleReaction}
          likeLabel={buttonsLabels.like}
          dislikeLabel={buttonsLabels.dislike}
        />
      </ViewGap>
    )
  }

  return null
}
