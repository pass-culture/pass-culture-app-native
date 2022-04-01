import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'
import { CulturalSurveyPageHeader } from 'features/culturalSurvey/components/layout/CulturalSurveyPageHeader'
import { useShouldEnableScrollOnView } from 'features/identityCheck/utils/useShouldEnableScrollView'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing, Spacer } from 'ui/theme'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

export const CulturalSurveyQuestions = (): JSX.Element => {
  const [bottomChildrenViewHeight, setBottomChildrenViewHeight] = useState(0)

  const { onScrollViewLayout, onScrollViewContentSizeChange } = useShouldEnableScrollOnView()

  function onFixedBottomChildrenViewLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomChildrenViewHeight(height)
  }

  // TODO PC-13347 (yorickeando): replace mock data by backend response from adequate react query
  const CulturalSurveyData = [
    {
      title: 'Visité un musée',
      subtitle: 'un monument, une exposition...',
    },
    {
      title: 'Acheté un cheval',
      subtitle: "un poney, un cochon d'inde...",
    },
    {
      title: 'Trait une vache',
      subtitle: 'une poule, un zébu...',
    },
    {
      title: 'Epicé un plat déjà épicé',
      subtitle: 'une soupe, une carotte râpée...',
    },
    {
      title: 'Emis un son suraigu',
      subtitle: 'un La 880, un La 1760...',
    },
    {
      title: 'Investi dans la brique',
      subtitle: 'le mortier, la pâte à modeler, le plâtre, le placo bon marché...',
    },
    {
      title: 'Ecrit tes mémoires en braille',
      subtitle: 'en latin, en schtroumpf...',
    },
    {
      title: 'Rien de tout ça',
      subtitle: 'ma vie est standard',
    },
  ]

  return (
    <Container>
      <CulturalSurveyPageHeader progress={0.5} title={'Tes sorties'} />

      <ChildrenScrollView
        bottomChildrenViewHeight={bottomChildrenViewHeight}
        onContentSizeChange={onScrollViewContentSizeChange}
        onLayout={onScrollViewLayout}>
        <VerticalUl>
          {CulturalSurveyData.map((answer) => (
            <Li key={answer.title}>
              <CheckboxContainer>
                <CulturalSurveyCheckbox title={answer.title} subtitle={answer.subtitle} />
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
      paddingBottom: bottomChildrenViewHeight,
      width: '100%',
      paddingHorizontal: getSpacing(5),
    },
  })
)<ChildrenScrollViewProps>({})

const CheckboxContainer = styled.View({
  paddingBottom: getSpacing(3),
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
