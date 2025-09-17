import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { LayoutChangeEvent, NativeScrollEvent, View } from 'react-native'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { CulturalSurveyAnswer, CulturalSurveyAnswerEnum, CulturalSurveyQuestionEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { CulturalSurveyPageHeader } from 'features/culturalSurvey/components/CulturalSurveyPageHeader'
import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { mapQuestionIdToPageTitle } from 'features/culturalSurvey/helpers/mapQuestionIdToPageTitle'
import {
  addSubQuestionToQuestionsToDisplay,
  removeSubQuestionsToDisplay,
} from 'features/culturalSurvey/helpers/questionsToDisplay'
import { useCulturalSurveyProgress } from 'features/culturalSurvey/helpers/useCulturalSurveyProgress'
import { useGetNextQuestion } from 'features/culturalSurvey/helpers/useGetNextQuestion'
import { useCulturalSurveyAnswersMutation } from 'features/culturalSurvey/queries/useCulturalSurveyAnswersMutation'
import { useCulturalSurveyQuestionsQuery } from 'features/culturalSurvey/queries/useCulturalSurveyQuestionsQuery'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { mapCulturalSurveyTypeToIcon } from 'libs/parsers/culturalSurveyType'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'
import { Li } from 'ui/components/Li'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { VerticalUl } from 'ui/components/Ul'
import { Page } from 'ui/pages/Page'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export function CulturalSurveyQuestions() {
  const enableCulturalSurveyMandatory = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY
  )
  const [bottomChildrenViewHeight, setBottomChildrenViewHeight] = useState(0)
  const { push, reset } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'CulturalSurveyQuestions'>>()
  const { data: culturalSurveyQuestionsData } = useCulturalSurveyQuestionsQuery()
  const { nextQuestion, isCurrentQuestionLastQuestion } = useGetNextQuestion(params?.question)
  const culturalSurveyProgress = useCulturalSurveyProgress(params?.question)
  const { showErrorSnackBar } = useSnackBarContext()
  const { refetchUser } = useAuthContext()

  function onFixedBottomChildrenViewLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomChildrenViewHeight(height)
  }

  const currentQuestion = params?.question
  const { goBack } = useGoBack(...homeNavigationConfig)
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

  const onSuccess = async () => {
    await refetchUser()
    dispatch({ type: 'FLUSH_ANSWERS' })
    performReset()
  }

  const performReset = () => {
    if (enableCulturalSurveyMandatory) {
      reset({
        index: 1,
        routes: [
          {
            name: 'SubscriptionStackNavigator',
            state: {
              routes: [{ name: 'Stepper' }],
            },
          },
          {
            name: 'SubscriptionStackNavigator',
            state: {
              routes: [{ name: 'CulturalSurveyThanks' }],
            },
          },
        ],
      })
    } else {
      reset({
        index: 1,
        routes: [
          {
            name: navigateToHomeConfig.screen,
          },
          {
            name: 'SubscriptionStackNavigator',
            state: {
              routes: [{ name: 'CulturalSurveyThanks' }],
            },
          },
        ],
      })
    }
  }

  const onError = (error: unknown) => {
    navigateToHome()
    showErrorSnackBar({ message: extractApiErrorMessage(error), timeout: SNACK_BAR_TIME_OUT })
  }

  const { mutate: postCulturalSurveyAnswers } = useCulturalSurveyAnswersMutation({
    onSuccess,
    onError,
  })

  const culturalSurveyQuestion = culturalSurveyQuestionsData?.questions?.find(
    (question) => question.id === params?.question
  )

  const logCulturalSurveyScrolledToBottom = useFunctionOnce(
    useCallback(
      () => analytics.logCulturalSurveyScrolledToBottom({ questionId: culturalSurveyQuestion?.id }),
      [culturalSurveyQuestion?.id]
    )
  )

  if (!culturalSurveyQuestionsData) return null

  const navigateToNextQuestion = () => {
    if (isCurrentQuestionLastQuestion) {
      postCulturalSurveyAnswers({ answers })
    } else if (nextQuestion) {
      push(...getSubscriptionHookConfig('CulturalSurveyQuestions', { question: nextQuestion }))
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

    currentQuestion &&
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

  const pageSubtitle = 'Tu peux sélectionner une ou plusieurs réponses.'

  const onGoBack = () => {
    goBack()
    currentQuestion &&
      dispatch({
        type: 'SET_ANSWERS',
        payload: {
          questionId: currentQuestion,
          answers: [],
        },
      })

    if (currentQuestion === CulturalSurveyQuestionEnum.SORTIES) {
      const INITIAL_CULTURAL_SURVEY_QUESTIONS = [
        CulturalSurveyQuestionEnum.SORTIES,
        CulturalSurveyQuestionEnum.ACTIVITES,
        CulturalSurveyQuestionEnum.PROJECTIONS,
      ]

      dispatch({
        type: 'SET_QUESTIONS',
        payload: INITIAL_CULTURAL_SURVEY_QUESTIONS,
      })
    }
  }

  function onScroll({ nativeEvent }: { nativeEvent: NativeScrollEvent }) {
    if (isCloseToBottom(nativeEvent)) {
      logCulturalSurveyScrolledToBottom()
    }
  }

  return (
    <Page>
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
          <StyledBodyAccentXs>{pageSubtitle}</StyledBodyAccentXs>
        </CaptionContainer>
        <StyledVerticalUl>
          {culturalSurveyQuestion?.answers.map((answer) => (
            <Li key={answer.id}>
              <Checkbox
                label={answer.title}
                variant="detailed"
                description={answer?.subtitle ?? ''}
                onPress={handleToggleAnswer(answer)}
                isChecked={isAnswerAlreadySelected(answer)}
                asset={{ variant: 'icon', Icon: mapCulturalSurveyTypeToIcon(answer?.id) }}
              />
            </Li>
          ))}
        </StyledVerticalUl>
      </ChildrenScrollView>
      <FixedBottomChildrenView onLayout={onFixedBottomChildrenViewLayout}>
        <ButtonPrimary
          onPress={() => {
            navigateToNextQuestion()
          }}
          disabled={!currentAnswers.length}
          wording={isCurrentQuestionLastQuestion ? 'Valider' : 'Continuer'}
          accessibilityLabel={
            isCurrentQuestionLastQuestion
              ? 'Valider le formulaire'
              : 'Continuer vers l’étape suivante'
          }
        />
        <Spacer.BottomScreen />
      </FixedBottomChildrenView>
    </Page>
  )
}

type ChildrenScrollViewProps = { bottomChildrenViewHeight: number }
const ChildrenScrollView = styled.ScrollView.attrs<ChildrenScrollViewProps>(
  ({ bottomChildrenViewHeight, theme }) => ({
    keyboardShouldPersistTaps: 'handled',
    keyboardDismissMode: 'on-drag',
    contentContainerStyle: {
      flexGrow: 1,
      alignSelf: 'center',
      flexDirection: 'column',
      marginTop: getSpacing(5),
      paddingBottom: bottomChildrenViewHeight,
      width: '100%',
      paddingHorizontal: theme.contentPage.marginHorizontal,
    },
  })
)<ChildrenScrollViewProps>({})

const StyledVerticalUl = styled(VerticalUl)({
  gap: getSpacing(3),
})

const CaptionContainer = styled.View({
  paddingTop: getSpacing(2),
  paddingBottom: getSpacing(8),
})

const FixedBottomChildrenView = styled(View)({
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

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
