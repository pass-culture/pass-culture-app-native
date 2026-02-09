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
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Button } from 'ui/designSystem/Button/Button'
import { CheckboxGroup } from 'ui/designSystem/CheckboxGroup/CheckboxGroup'
import { CheckboxGroupOption } from 'ui/designSystem/CheckboxGroup/types'
import { Page } from 'ui/pages/Page'
import { Spacer } from 'ui/theme'

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

  const { goBack } = useGoBack(...homeNavigationConfig)
  const { answers, dispatch, questionsToDisplay } = useCulturalSurveyContext()

  const [currentAnswers, setCurrentAnswers] = useState<CulturalSurveyAnswerEnum[]>([])
  const currentQuestion = params?.question

  useEffect(() => {
    const currentQuestionAnswers = answers.find(
      (answer) => answer.questionId === currentQuestion
    )?.answerIds

    if (currentQuestionAnswers) {
      setCurrentAnswers(currentQuestionAnswers)
    }
  }, [currentQuestion, answers])

  function onFixedBottomChildrenViewLayout(event: LayoutChangeEvent) {
    setBottomChildrenViewHeight(event.nativeEvent.layout.height)
  }

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
            state: { routes: [{ name: 'Stepper' }] },
          },
          {
            name: 'SubscriptionStackNavigator',
            state: { routes: [{ name: 'CulturalSurveyThanks' }] },
          },
        ],
      })
    } else {
      reset({
        index: 1,
        routes: [
          { name: navigateToHomeConfig.screen },
          {
            name: 'SubscriptionStackNavigator',
            state: { routes: [{ name: 'CulturalSurveyThanks' }] },
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
    (question) => question.id === currentQuestion
  )

  const logCulturalSurveyScrolledToBottom = useFunctionOnce(
    useCallback(
      () => analytics.logCulturalSurveyScrolledToBottom({ questionId: culturalSurveyQuestion?.id }),
      [culturalSurveyQuestion?.id]
    )
  )

  if (!culturalSurveyQuestionsData || !culturalSurveyQuestion) return null

  const navigateToNextQuestion = () => {
    if (isCurrentQuestionLastQuestion) {
      postCulturalSurveyAnswers({ answers })
    } else if (nextQuestion) {
      push(...getSubscriptionHookConfig('CulturalSurveyQuestions', { question: nextQuestion }))
    }
  }

  const updateQuestionsToDisplay = (
    subQuestionId: CulturalSurveyQuestionEnum,
    isAnswerSelected: boolean
  ) => {
    const updatedQuestionsToDisplay = isAnswerSelected
      ? addSubQuestionToQuestionsToDisplay(subQuestionId, questionsToDisplay)
      : removeSubQuestionsToDisplay(subQuestionId, questionsToDisplay)

    dispatch({ type: 'SET_QUESTIONS', payload: updatedQuestionsToDisplay })
  }

  const updateAnswers = (answer: CulturalSurveyAnswer, isAnswerSelected: boolean) => {
    const updatedAnswers = isAnswerSelected
      ? currentAnswers.filter((answerId) => answerId !== answer.id)
      : [...currentAnswers, answer.id]

    currentQuestion &&
      dispatch({
        type: 'SET_ANSWERS',
        payload: { questionId: currentQuestion, answers: updatedAnswers },
      })
  }

  const handleCheckboxGroupChange = (newValues: CulturalSurveyAnswerEnum[]) => {
    const added = newValues.filter((v) => !currentAnswers.includes(v))
    const removed = currentAnswers.filter((v) => !newValues.includes(v))

    added.forEach((answerId) => {
      const answer = culturalSurveyQuestion.answers.find((a) => a.id === answerId)
      if (!answer) return
      updateAnswers(answer, false)
      if (answer.sub_question) updateQuestionsToDisplay(answer.sub_question, false)
    })

    removed.forEach((answerId) => {
      const answer = culturalSurveyQuestion.answers.find((a) => a.id === answerId)
      if (!answer) return
      updateAnswers(answer, true)
      if (answer.sub_question) updateQuestionsToDisplay(answer.sub_question, true)
    })
  }

  const pageSubtitle = 'Tu peux sélectionner une ou plusieurs réponses.'

  function onScroll({ nativeEvent }: { nativeEvent: NativeScrollEvent }) {
    if (isCloseToBottom(nativeEvent)) logCulturalSurveyScrolledToBottom()
  }

  const checkboxOptions: CheckboxGroupOption<CulturalSurveyAnswerEnum>[] =
    culturalSurveyQuestion.answers.map((answer) => ({
      value: answer.id,
      label: answer.title,
      description: answer.subtitle ?? '',
      variant: 'detailed',
      asset: { variant: 'icon', Icon: mapCulturalSurveyTypeToIcon(answer.id) },
    }))

  const onGoBack = () => {
    goBack()
    currentQuestion &&
      dispatch({ type: 'SET_ANSWERS', payload: { questionId: currentQuestion, answers: [] } })

    if (currentQuestion === CulturalSurveyQuestionEnum.SORTIES) {
      dispatch({
        type: 'SET_QUESTIONS',
        payload: [
          CulturalSurveyQuestionEnum.SORTIES,
          CulturalSurveyQuestionEnum.ACTIVITES,
          CulturalSurveyQuestionEnum.PROJECTIONS,
        ],
      })
    }
  }

  return (
    <Page>
      <Spacer.TopScreen />

      <CulturalSurveyPageHeader
        progress={culturalSurveyProgress}
        title={mapQuestionIdToPageTitle(culturalSurveyQuestion.id)}
        onGoBack={onGoBack}
      />

      <ChildrenScrollView
        bottomChildrenViewHeight={bottomChildrenViewHeight}
        onScroll={onScroll}
        testID="cultural-survey-questions-scrollview">
        <CheckboxGroup<CulturalSurveyAnswerEnum>
          label={culturalSurveyQuestion.title}
          labelTag="h2"
          description={pageSubtitle}
          options={checkboxOptions}
          value={currentAnswers}
          onChange={handleCheckboxGroupChange}
          variant="detailed"
          display="vertical"
        />
      </ChildrenScrollView>

      <FixedBottomChildrenView onLayout={onFixedBottomChildrenViewLayout}>
        <Button
          fullWidth
          onPress={navigateToNextQuestion}
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
      marginTop: theme.designSystem.size.spacing.m,
      paddingBottom: bottomChildrenViewHeight,
      width: '100%',
      paddingHorizontal: theme.contentPage.marginHorizontal,
    },
  })
)<ChildrenScrollViewProps>({})

const FixedBottomChildrenView = styled(View)(({ theme }) => ({
  alignItems: 'center',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingBottom: theme.designSystem.size.spacing.xl,
  paddingTop: theme.designSystem.size.spacing.m,
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))
