import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CardSelector } from 'features/moodSurvey/components/CardSelector'
import { SurveyData } from 'features/moodSurvey/types'
import { Spacer } from 'ui/components/spacer/Spacer'

type Props = {
  goToNextQuestion: (newSurveyData: Partial<SurveyData>) => void
}

export const EmojiQuestion: FunctionComponent<Props> = ({ goToNextQuestion }) => {
  return (
    <React.Fragment>
      <SurveyContainer>
        <Row>
          <CardSelector title="Festif" onPress={() => goToNextQuestion({ emoji: 'Festif' })} />
          <Spacer.Row numberOfSpaces={4} />
          <CardSelector title="Chill" onPress={() => goToNextQuestion({ emoji: 'Chill' })} />
        </Row>
        <Spacer.Column numberOfSpaces={4} />
        <Row>
          <CardSelector title="In love" onPress={() => goToNextQuestion({ emoji: 'In love' })} />
          <Spacer.Row numberOfSpaces={4} />
          <CardSelector title="Aventure" onPress={() => goToNextQuestion({ emoji: 'Aventure' })} />
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
  flex: 1,
}))
