import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import {
  CulturalSurveyAnswer,
  CulturalSurveyAnswerEnum,
  CulturalSurveyQuestion,
  CulturalSurveyQuestionEnum,
  CulturalSurveyTypeCodeKey,
} from 'api/gen'
import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'
import { CulturalSurveyPageHeader } from 'features/culturalSurvey/components/layout/CulturalSurveyPageHeader'
import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { mapQuestionIdToPageTitle } from 'features/culturalSurvey/helpers/utils'
import { useCulturalSurveyQuestions } from 'features/culturalSurvey/useCulturalSurvey'
import { useCulturalSurveyProgress } from 'features/culturalSurvey/useCulturalSurveyProgress'
import { useGetNextStep } from 'features/culturalSurvey/useGetNextStep'
import { navigateToHome } from 'features/navigation/helpers'
import {
  CulturalSurveyRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { mapCulturalSurveyTypeToIcon } from 'libs/parsers/culturalSurveyType'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

type CulturalSurveyQuestionsProps = StackScreenProps<
  CulturalSurveyRootStackParamList,
  'CulturalSurveyQuestions'
>

export const CulturalSurveyQuestions = ({ route }: CulturalSurveyQuestionsProps): JSX.Element => {
  const [bottomChildrenViewHeight, setBottomChildrenViewHeight] = useState(0)
  const { push } = useNavigation<UseNavigationType>()
  const { data: culturalSurveyQuestionsData } = useCulturalSurveyQuestions()
  const { nextStep, isCurrentStepLastStep } = useGetNextStep(route.params.step)
  const culturalSurveyProgress = useCulturalSurveyProgress(route.params.step)

  function onFixedBottomChildrenViewLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomChildrenViewHeight(height)
  }

  const step = route.params.step
  const { goBack } = useGoBack(...homeNavConfig)
  const { answers, dispatch, questionsToDisplay } = useCulturalSurveyContext()
  const [currentAnswers, setCurrentAnswers] = useState<CulturalSurveyAnswerEnum[]>([])

  useEffect(() => {
    const currentQuestionAnswers = answers.find((answer) => answer.questionId === step)?.answerIds
    if (currentQuestionAnswers) {
      setCurrentAnswers(currentQuestionAnswers)
    }
  }, [step, answers])

  const culturalSurveyQuestion = culturalSurveyQuestionsData.questions.find(
    (question) => question.id === route.params.step
  ) as CulturalSurveyQuestion

  const navigateToNextStep = () => {
    if (isCurrentStepLastStep) {
      navigateToHome()
    } else {
      push('CulturalSurveyQuestions', { step: nextStep })
    }
  }

  const isAnswerAlreadySelected = (answer: CulturalSurveyAnswer) => {
    return !!currentAnswers?.find((answerId) => answerId === answer.id)
  }

  const addSubQuestionToQuestionsToDisplay = (subQuestionId: CulturalSurveyQuestionEnum) => {
    let updatedQuestionsToDisplay = [...questionsToDisplay]
    updatedQuestionsToDisplay = updatedQuestionsToDisplay.filter(
      (questionId) => questionId != subQuestionId
    )
    return updatedQuestionsToDisplay
  }

  const removeSubQuestionsToDisplay = (subQuestionId: CulturalSurveyQuestionEnum) => {
    const updatedQuestionsToDisplay = [...questionsToDisplay]
    updatedQuestionsToDisplay.splice(1, 0, subQuestionId)
    return updatedQuestionsToDisplay
  }

  const updateQuestionsToDisplay = (
    subQuestionId: CulturalSurveyQuestionEnum,
    isAnswerSelected: boolean
  ) => {
    const updatedQuestionsToDisplay = isAnswerSelected
      ? addSubQuestionToQuestionsToDisplay(subQuestionId)
      : removeSubQuestionsToDisplay(subQuestionId)

    dispatch({
      type: 'SET_QUESTIONS',
      payload: updatedQuestionsToDisplay,
    })
  }
  const updateAnswers = (answer: CulturalSurveyAnswer, isAnswerSelected: boolean) => {
    const updatedAnswers = isAnswerSelected
      ? currentAnswers.filter((answerId) => answerId !== answer.id)
      : [...currentAnswers, answer.id]

    dispatch({
      type: 'SET_ANSWERS',
      payload: {
        questionId: step,
        answers: updatedAnswers,
      },
    })
  }

  const handleToggleAnswer = (answer: CulturalSurveyAnswer) => () => {
    const isAnswerSelected = isAnswerAlreadySelected(answer)

    updateAnswers(answer, isAnswerSelected)
    if (answer.sub_question) {
      updateQuestionsToDisplay(answer.sub_question, isAnswerSelected)
    }
  }

  const pageSubtitle = t`Tu peux sélectionner une ou plusieurs réponses.`

  const onGoBack = () => {
    goBack()
    dispatch({
      type: 'SET_ANSWERS',
      payload: {
        questionId: step,
        answers: [],
      },
    })
  }

  return (
    <Container>
      <CulturalSurveyPageHeader
        progress={culturalSurveyProgress}
        title={mapQuestionIdToPageTitle(culturalSurveyQuestion?.id)}
        onGoBack={onGoBack}
      />
      <ChildrenScrollView bottomChildrenViewHeight={bottomChildrenViewHeight}>
        <Typo.Title3>{culturalSurveyQuestion?.title}</Typo.Title3>
        <CaptionContainer>
          <GreyCaption>{pageSubtitle}</GreyCaption>
        </CaptionContainer>
        <VerticalUl>
          {culturalSurveyQuestion?.answers.map((answer) => (
            <Li key={answer.id}>
              <CheckboxContainer>
                <CulturalSurveyCheckbox
                  selected={isAnswerAlreadySelected(answer)}
                  onPress={handleToggleAnswer(answer)}
                  title={answer.title}
                  subtitle={answer?.subtitle}
                  // @ts-ignore TODO yorickeando: once the mapCulturalSurveyTypeToIcon helper
                  // is correctly typed
                  icon={mapCulturalSurveyTypeToIcon(answer?.id as CulturalSurveyTypeCodeKey)}
                />
              </CheckboxContainer>
            </Li>
          ))}
        </VerticalUl>
      </ChildrenScrollView>
      <FixedBottomChildrenView onLayout={onFixedBottomChildrenViewLayout}>
        <ButtonPrimary
          onPress={() => {
            navigateToNextStep()
          }}
          wording={t`Continuer`}
          testID={'next-cultural-survey-question'}
          accessibilityLabel={t`Continuer vers l'étape suivante`}
        />
        <Spacer.BottomScreen />
      </FixedBottomChildrenView>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignSelf: 'center',
  maxWidth: theme.forms.maxWidth,
  flexDirection: 'column',
}))

type ChildrenScrollViewProps = { bottomChildrenViewHeight: number }
const ChildrenScrollView = styled.ScrollView.attrs<ChildrenScrollViewProps>(
  ({ bottomChildrenViewHeight }) => ({
    keyboardShouldPersistTaps: 'handled',
    keyboardDismissMode: 'on-drag',
    contentContainerStyle: {
      flexGrow: 1,
      alignSelf: 'center',
      flexDirection: 'column',
      marginTop: getSpacing(5),
      paddingBottom: bottomChildrenViewHeight,
      width: '100%',
      paddingHorizontal: getSpacing(5),
    },
  })
)<ChildrenScrollViewProps>({})

const CheckboxContainer = styled.View({
  paddingBottom: getSpacing(3),
})

const GreyCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const CaptionContainer = styled.View({
  paddingTop: getSpacing(2),
  paddingBottom: getSpacing(8),
})

const FixedBottomChildrenView = styled.View({
  alignItems: 'center',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingBottom: getSpacing(5),
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingTop: getSpacing(3),
  paddingHorizontal: getSpacing(5),
})
