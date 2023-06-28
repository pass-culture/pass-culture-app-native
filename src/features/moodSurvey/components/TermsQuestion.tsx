import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { TermsOption } from 'features/moodSurvey/components/TermsOption'
import { SurveyData } from 'features/moodSurvey/types'
import { Spacer } from 'ui/components/spacer/Spacer'
import { getSpacing } from 'ui/theme'

type Props = {
  goToNextQuestion: (newSurveyData: Partial<SurveyData>) => void
}

const SURVEY_HEIGHT = getSpacing(60)

export const TermsQuestion: FunctionComponent<Props> = ({ goToNextQuestion }) => {
  return (
    <React.Fragment>
      <SurveyContainer>
        <TermsOption
          moment="Maintenant"
          onPress={() => goToNextQuestion({ terms: 'Maintenant' })}
        />
        <Spacer.Column numberOfSpaces={2} />
        <TermsOption
          moment="Cette semaine"
          onPress={() => goToNextQuestion({ terms: 'Cette semaine' })}
        />
        <Spacer.Column numberOfSpaces={2} />
        <TermsOption
          moment="Je suis dispo tout le temps"
          onPress={() => goToNextQuestion({ terms: 'Je suis dispo tout le temps' })}
        />
      </SurveyContainer>
    </React.Fragment>
  )
}

const SurveyContainer = styled.View(({ theme }) => ({
  height: SURVEY_HEIGHT,
  width: '100%',
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
