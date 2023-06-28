import { useNavigation, useFocusEffect } from '@react-navigation/native'
import React, { FunctionComponent, useState, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { EmojiQuestion } from 'features/moodSurvey/components/EmojiQuestion'
import { MoodboardQuestion } from 'features/moodSurvey/components/MoodboardQuestion'
import { PersonaQuestion } from 'features/moodSurvey/components/PersonaQuestion'
import { TermsQuestion } from 'features/moodSurvey/components/TermsQuestion'
import {
  MoodSurveyStepProps,
  SurveyData,
  MoodSurveyMoodboardStepProps,
} from 'features/moodSurvey/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { BackButton } from 'ui/components/headers/BackButton'
import { BackgroundBlueWithDefaultStatusBar } from 'ui/svg/BackgroundBlue'
import { Typo, getSpacing, Spacer } from 'ui/theme'

type SurveyStepConfig = {
  name: string
  headerTitle: string
  Component:
    | React.FunctionComponent<MoodSurveyStepProps>
    | React.FunctionComponent<MoodSurveyMoodboardStepProps>
}

const SURVEY_STEP_CONFIG: SurveyStepConfig[] = [
  {
    name: 'EmojiQuestion',
    headerTitle: 'T‘es dans quel mood\u00a0?',
    Component: EmojiQuestion,
  },
  {
    name: 'TermsQuestion',
    headerTitle: 'C‘est quoi tes dispos\u00a0?',
    Component: TermsQuestion,
  },
  {
    name: 'Moodboard',
    headerTitle: 'T‘es dans quelle ambiance\u00a0?',
    Component: MoodboardQuestion,
  },
  {
    name: 'Moodboard',
    headerTitle: 'À quel personnage t‘identifies-tu\u00a0?',
    Component: PersonaQuestion,
  },
]

const SURVEY_NUMBER_OF_STEP = SURVEY_STEP_CONFIG.length

export const MoodQuestions: FunctionComponent = () => {
  const [index, setIndex] = useState(0)
  const isFirstStep = index === 0
  const [surveyData, setSurveyData] = useState<SurveyData>({
    emoji: '',
    terms: '',
    moodboard: '',
    persona: '',
  })
  const { navigate, addListener } = useNavigation<UseNavigationType>()

  const questionConfig = SURVEY_STEP_CONFIG[index]
  const theme = useTheme()

  const goToNextQuestion = (newSurveyData: Partial<SurveyData>) => {
    setSurveyData((prevSurveyData) => ({ ...prevSurveyData, ...newSurveyData }))
    if (index < SURVEY_NUMBER_OF_STEP - 1) {
      setIndex(index + 1)
    } else {
      navigate('MoodResults', { ...surveyData })
    }
  }

  function goToPreviousQuestion() {
    setIndex((prevIndex) => Math.max(0, prevIndex - 1))
  }

  // We use useFocusEffect(...) because we want to remove the BackHandler listener on blur
  // otherwise the logic of the "back action" would leak to other components / screens.
  useFocusEffect(
    useCallback(() => {
      return addListener('beforeRemove', (event) => {
        // For overriding iOS and Android go back and pop screen behaviour
        const isGoBackAction = ['GO_BACK', 'POP'].includes(event.data.action.type)
        if (!isGoBackAction || isFirstStep) return // Remove screen
        goToPreviousQuestion()
        event.preventDefault() // Do not remove screen
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFirstStep])
  )

  const isMoodboardForLovers = index === 2 && surveyData.emoji === 'In love'

  const customHeaderTitle = isMoodboardForLovers
    ? 'T‘es dans quelle ambiance avec ton date\u00a0?'
    : SURVEY_STEP_CONFIG[index].headerTitle

  return (
    <React.Fragment>
      <BackgroundBlueWithDefaultStatusBar />
      <PageContainer>
        <GoBackContainer>
          <BackButton
            color={theme.colors.white}
            onGoBack={isFirstStep ? undefined : goToPreviousQuestion}
          />
        </GoBackContainer>
        <Spacer.Column numberOfSpaces={8} />
        <WhiteHeader>{customHeaderTitle}</WhiteHeader>
        <Spacer.Column numberOfSpaces={8} />
        <Container>
          <Spacer.Column numberOfSpaces={4} />
          <questionConfig.Component goToNextQuestion={goToNextQuestion} emoji={surveyData.emoji} />
          <Spacer.Column numberOfSpaces={4} />
        </Container>
      </PageContainer>
    </React.Fragment>
  )
}

const PageContainer = styled.View({
  padding: getSpacing(4),
})

const Container = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
})

const WhiteHeader = styled(Typo.Title3)(({ theme }) => ({
  color: theme.colors.white,
}))

const GoBackContainer = styled.View({})
