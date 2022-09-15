import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useCallback, useEffect, useState } from 'react'
import { LayoutChangeEvent, NativeScrollEvent } from 'react-native'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import {
  CulturalSurveyAnswer,
  CulturalSurveyAnswerEnum,
  CulturalSurveyQuestion,
  CulturalSurveyQuestionEnum,
} from 'api/gen'
import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'
import { CulturalSurveyPageHeader } from 'features/culturalSurvey/components/layout/CulturalSurveyPageHeader'
import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import {
  addSubQuestionToQuestionsToDisplay,
  mapQuestionIdToPageTitle,
  removeSubQuestionsToDisplay,
} from 'features/culturalSurvey/helpers/utils'
import {
  useCulturalSurveyQuestions,
  useCulturalSurveyAnswersMutation,
} from 'features/culturalSurvey/useCulturalSurvey'
import { useCulturalSurveyProgress } from 'features/culturalSurvey/useCulturalSurveyProgress'
import { useGetNextQuestion } from 'features/culturalSurvey/useGetNextQuestion'
import { navigateToHome } from 'features/navigation/helpers'
import {
  CulturalSurveyRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics, isCloseToBottom } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { mapCulturalSurveyTypeToIcon } from 'libs/parsers/culturalSurveyType'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
import { Li } from 'ui/components/Li'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type CulturalSurveyQuestionsProps = StackScreenProps<
  CulturalSurveyRootStackParamList,
  'CulturalSurveyQuestions'
>

export const CulturalSurveyQuestions = ({ route }: CulturalSurveyQuestionsProps): JSX.Element => {
  const [bottomChildrenViewHeight, setBottomChildrenViewHeight] = useState(0)
  const { push, navigate } = useNavigation<UseNavigationType>()
  const { data: culturalSurveyQuestionsData } = useCulturalSurveyQuestions()
  const { nextQuestion, isCurrentQuestionLastQuestion } = useGetNextQuestion(route.params.question)
  const culturalSurveyProgress = useCulturalSurveyProgress(route.params.question)
  const { showErrorSnackBar } = useSnackBarContext()

  function onFixedBottomChildrenViewLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomChildrenViewHeight(height)
  }

  const currentQuestion = route.params.question
  const { goBack } = useGoBack(...homeNavConfig)
  const { answers, dispatch, questionsToDisplay } = useCulturalSurveyContext()
  const [currentAnswers, setCurrentAnswers] = useState<CulturalSurveyAnswerEnum[]>([])

  useEffect(() => {
    const currentQuestionAnswers = answers.find(
      (answer) => answer.questionId === currentQuestion
    )?.answerIds
    if (currentQuestionAnswers) {
      setCurrentAnswers(currentQuestionAnswers)
    }
  }, [currentQuestion, answers])

  if (!culturalSurveyQuestionsData?.questions) {
    throw new Error('should have questions to show')
  }
  const onSuccess = () => {
    dispatch({
      type: 'FLUSH_ANSWERS',
    })
    navigate('CulturalSurveyThanks')
  }

  const onError = (error: unknown) => {
    navigateToHome()
    showErrorSnackBar({ message: extractApiErrorMessage(error), timeout: SNACK_BAR_TIME_OUT })
  }

  const { mutate: postCulturalSurveyAnswers } = useCulturalSurveyAnswersMutation({
    onSuccess,
    onError,
  })

  const culturalSurveyQuestion = culturalSurveyQuestionsData?.questions.find(
    (question) => question.id === route.params.question
  ) as CulturalSurveyQuestion

  const logCulturalSurveyScrolledToBottom = useFunctionOnce(
    useCallback(
      () => analytics.logCulturalSurveyScrolledToBottom({ questionId: culturalSurveyQuestion?.id }),
      [culturalSurveyQuestion?.id]
    )
  )

  if (!culturalSurveyQuestionsData) return <React.Fragment />

  const navigateToNextQuestion = () => {
    if (isCurrentQuestionLastQuestion) {
      postCulturalSurveyAnswers({ answers })
    } else {
      push('CulturalSurveyQuestions', { question: nextQuestion })
    }
  }

  const isAnswerAlreadySelected = (answer: CulturalSurveyAnswer) => {
    return !!currentAnswers?.find((answerId) => answerId === answer.id)
  }

  const updateQuestionsToDisplay = (
    subQuestionId: CulturalSurveyQuestionEnum,
    isAnswerSelected: boolean
  ) => {
    const updatedQuestionsToDisplay = isAnswerSelected
      ? addSubQuestionToQuestionsToDisplay(subQuestionId, questionsToDisplay)
      : removeSubQuestionsToDisplay(subQuestionId, questionsToDisplay)

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
        questionId: currentQuestion,
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
        questionId: currentQuestion,
        answers: [],
      },
    })
  }

  function onScroll({ nativeEvent }: { nativeEvent: NativeScrollEvent }) {
    if (isCloseToBottom(nativeEvent)) {
      logCulturalSurveyScrolledToBottom()
    }
  }

  return (
    <Container>
      <Spacer.TopScreen />
      <CulturalSurveyPageHeader
        progress={culturalSurveyProgress}
        title={mapQuestionIdToPageTitle(culturalSurveyQuestion?.id)}
        onGoBack={onGoBack}
      />
      <ChildrenScrollView
        bottomChildrenViewHeight={bottomChildrenViewHeight}
        onScroll={onScroll}
        testID="cultural-survey-questions-scrollview">
        <Typo.Title3>{culturalSurveyQuestion?.title}</Typo.Title3>
        <CaptionContainer>
          <GreyDarkCaption>{pageSubtitle}</GreyDarkCaption>
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
                  icon={mapCulturalSurveyTypeToIcon(answer?.id)}
                />
              </CheckboxContainer>
            </Li>
          ))}
        </VerticalUl>
      </ChildrenScrollView>
      <FixedBottomChildrenView onLayout={onFixedBottomChildrenViewLayout}>
        <ButtonPrimary
          onPress={() => {
            navigateToNextQuestion()
          }}
          disabled={!currentAnswers.length}
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
  width: '100%',
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
      paddingHorizontal: getSpacing(6),
    },
  })
)<ChildrenScrollViewProps>({})

const CheckboxContainer = styled.View({
  paddingBottom: getSpacing(3),
})

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
  paddingHorizontal: getSpacing(6),
})
