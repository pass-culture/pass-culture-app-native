import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { CulturalSurveyTypeCodeKey } from 'api/gen'
import { mockCulturalSurveyQuestions } from 'features/culturalSurvey/__mocks__/culturalSurveyQuestions'
import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'
import { CulturalSurveyPageHeader } from 'features/culturalSurvey/components/layout/CulturalSurveyPageHeader'
import { mapQuestionIdToPageTitle } from 'features/culturalSurvey/helpers/utils'
import { useGetNextStep } from 'features/culturalSurvey/useGetNextStep'
import { navigateToHome } from 'features/navigation/helpers'
import {
  CulturalSurveyRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
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

  function onFixedBottomChildrenViewLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomChildrenViewHeight(height)
  }

  const { nextStep, isCurrentStepLastStep } = useGetNextStep(route.params?.step)

  // TODO (yorickeando) PC-13347: replace mock data by backend response from adequate react query
  const mockedData = mockCulturalSurveyQuestions.questions.find(
    (question) => question.id === route.params?.step
  )

  const navigateToNextStep = () => {
    if (isCurrentStepLastStep) {
      navigateToHome()
    } else {
      push('CulturalSurveyQuestions', { step: nextStep })
    }
  }

  const pageSubtitle = t`Tu peux sélectionner une ou plusieurs réponses.`

  return (
    <Container>
      <CulturalSurveyPageHeader progress={0.5} title={mapQuestionIdToPageTitle(mockedData?.id)} />
      <ChildrenScrollView bottomChildrenViewHeight={bottomChildrenViewHeight}>
        <Typo.Title3>{mockedData?.title}</Typo.Title3>
        <CaptionContainer>
          <GreyCaption>{pageSubtitle}</GreyCaption>
        </CaptionContainer>
        <VerticalUl>
          {mockedData?.answers.map((answer) => (
            <Li key={answer.id}>
              <CheckboxContainer>
                <CulturalSurveyCheckbox
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
