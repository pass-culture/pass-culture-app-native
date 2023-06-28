import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CardSelector } from 'features/moodSurvey/components/CardSelector'
import { SurveyData } from 'features/moodSurvey/types'
import { Spacer } from 'ui/components/spacer/Spacer'

type Props = {
  goToNextQuestion: (newSurveyData: Partial<SurveyData>) => void
}

export const PersonaQuestion: FunctionComponent<Props> = ({ goToNextQuestion }) => {
  return (
    <React.Fragment>
      <SurveyContainer>
        <Row>
          <CardSelector title="Krokmou" onPress={() => goToNextQuestion({ persona: 'Krokmou' })} />
          <Spacer.Row numberOfSpaces={4} />
          <CardSelector
            title="Tony Stark"
            onPress={() => goToNextQuestion({ persona: 'Tony Stark' })}
          />
        </Row>
        <Spacer.Column numberOfSpaces={4} />
        <Row>
          <CardSelector title="Cheryl" onPress={() => goToNextQuestion({ persona: 'Cheryl' })} />
          <Spacer.Row numberOfSpaces={4} />
          <CardSelector title="Itachi" onPress={() => goToNextQuestion({ persona: 'Itachi' })} />
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
