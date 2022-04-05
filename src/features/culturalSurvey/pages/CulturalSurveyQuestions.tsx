import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { CulturalSurveyTypeCodeKey } from 'api/gen'
import { mockCulturalSurveyQuestions } from 'features/culturalSurvey/__mocks__/culturalSurveyQuestions'
import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'
import { CulturalSurveyPageHeader } from 'features/culturalSurvey/components/layout/CulturalSurveyPageHeader'
import { mapCulturalSurveyTypeToIcon } from 'libs/parsers/culturalSurveyType'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import CulturalSurveyIcons from 'ui/svg/icons/culturalSurvey'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

export const CulturalSurveyQuestions = (): JSX.Element => {
  const [bottomChildrenViewHeight, setBottomChildrenViewHeight] = useState(0)

  function onFixedBottomChildrenViewLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomChildrenViewHeight(height)
  }

  // TODO (yorickeando) PC-13347: replace mock data by backend response from adequate react query
  const mockedData = mockCulturalSurveyQuestions.questions[0]

  const pageSubtitle = t`Tu peux sélectionner une ou plusieurs réponses.`

  return (
    <Container>
      <CulturalSurveyPageHeader progress={0.5} title={'Tes sorties'} />
      <ChildrenScrollView bottomChildrenViewHeight={bottomChildrenViewHeight}>
        <Typo.Title3>{mockedData.title}</Typo.Title3>
        <CaptionContainer>
          <GreyCaption>{pageSubtitle}</GreyCaption>
        </CaptionContainer>
        <VerticalUl>
          {mockedData.answers.map((answer) => (
            <Li key={answer.id}>
              <CheckboxContainer>
                <CulturalSurveyCheckbox
                  title={answer.title}
                  subtitle={answer?.subtitle}
                  // TODO yorickeando: once the api schema provides correct CulturalSurveyAnswerIdEnum
                  // type adequately
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
            // do nothing yet
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
