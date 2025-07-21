import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { ReactionTypeEnum } from 'api/gen'
import { MAX_WIDTH_VIDEO } from 'features/offer/constant'
import { ReactionChoiceValidation } from 'features/reactions/components/ReactionChoiceValidation/ReactionChoiceValidation'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

const getStorageKey = (offerId: number) => `feedback_reaction_${offerId}`

type Props = {
  offerId: number
}

export function FeedBackVideo({ offerId }: Props) {
  const [reaction, setReaction] = useState<ReactionTypeEnum | null>(null)

  useEffect(() => {
    const fetchReaction = async () => {
      const saved = await AsyncStorage.getItem(getStorageKey(offerId))
      if (saved === ReactionTypeEnum.LIKE || saved === ReactionTypeEnum.DISLIKE) {
        setReaction(saved)
      }
    }
    fetchReaction()
  }, [offerId])

  const handleReaction = useCallback(
    async (type: ReactionTypeEnum) => {
      setReaction(type)
      await AsyncStorage.setItem(getStorageKey(offerId), type)
    },
    [offerId]
  )

  const url =
    reaction === ReactionTypeEnum.LIKE
      ? 'https://passculture.qualtrics.com/jfe/form/SV_238Dd248lT6UuJE'
      : 'https://passculture.qualtrics.com/jfe/form/SV_3lb1IPodkGiMzWe'

  if (reaction) {
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

const Container = styled(ViewGap)({
  maxWidth: MAX_WIDTH_VIDEO,
})

const ButtonInsideTextPrimary = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.designSystem.color.text.brandPrimary,
}))``
