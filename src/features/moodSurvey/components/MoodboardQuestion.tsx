import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CardSelector } from 'features/moodSurvey/components/CardSelector'
import { mapEmojiToMoodboard } from 'features/moodSurvey/helpers/getMoodboardFromEmoji'
import { SurveyData, EmojiOption } from 'features/moodSurvey/types'
import { Spacer } from 'ui/components/spacer/Spacer'

type Props = {
  goToNextQuestion: (newSurveyData: Partial<SurveyData>) => void
  emoji: EmojiOption | ''
}

export const MoodboardQuestion: FunctionComponent<Props> = ({ goToNextQuestion, emoji }) => {
  const images = (emoji ? mapEmojiToMoodboard.get(emoji) : []) ?? []
  return (
    <React.Fragment>
      <SurveyContainer>
        <Row>
          <CardSelector
            title={images[0]}
            onPress={() => goToNextQuestion({ moodboard: images[0] })}
          />
          <Spacer.Row numberOfSpaces={4} />
          <CardSelector
            title={images[1]}
            onPress={() => goToNextQuestion({ moodboard: images[1] })}
          />
        </Row>
        <Spacer.Column numberOfSpaces={4} />

        <Row>
          <CardSelector
            title={images[2]}
            onPress={() => goToNextQuestion({ moodboard: images[2] })}
          />
          <Spacer.Row numberOfSpaces={4} />

          <CardSelector
            title={images[3]}
            onPress={() => goToNextQuestion({ moodboard: images[3] })}
          />
        </Row>
      </SurveyContainer>
    </React.Fragment>
  )
}

const Row = styled.View({
  flexDirection: 'row',
})

const SurveyContainer = styled.View(({ theme }) => ({
  width: '100%',
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
