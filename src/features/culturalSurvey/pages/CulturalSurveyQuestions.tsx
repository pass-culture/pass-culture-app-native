import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'
import { CulturalSurveyPageHeader } from 'features/culturalSurvey/components/layout/CulturalSurveyPageHeader'
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
  // TODO (yorickeando) : quand PC-13341 sera mergé, supprimé la clé "icon" de
  // la réponse du back et injecter mapCulturalSurveyIdToIcon(id) dans CulturalSurveyCheckbox
  const mockedData = {
    id: 'SORTIES',
    title: "Au cours de l'année précédente, tu as/es au moins une fois ...",
    answers: [
      {
        id: 'FESTIVAL',
        // clé factice, pour le dev, voir TODO
        icon: CulturalSurveyIcons.FestivalIcon,
        title: 'Participé à un festival,',
        subtitle: 'à une avant-première',
        sub_question: 'FESTIVALS',
      },
      {
        id: 'SPECTACLE',
        // clé factice, pour le dev, voir TODO
        icon: CulturalSurveyIcons.ShowIcon,
        title: 'Assisté à un spectacle',
        subtitle: 'Pièce de théâtre, cirque, danse...',
        sub_question: 'SPECTACLES',
      },
      {
        id: 'BIBLIOTHEQUE',
        // clé factice, pour le dev, voir TODO
        icon: CulturalSurveyIcons.BookstoreIcon,
        title: 'Allé à la bibliothèque',
        subtitle: 'ou à la médiathèque',
        sub_question: null,
      },
      {
        id: 'EVENEMENT_JEU',
        // clé factice, pour le dev, voir TODO
        icon: CulturalSurveyIcons.PuzzlePieceIcon,
        title: 'Participé à un jeu',
        subtitle: 'escape game, jeu concours',
        sub_question: null,
      },
      {
        id: 'CONCERT',
        // clé factice, pour le dev, voir TODO
        icon: CulturalSurveyIcons.MusicIcon,
        title: 'Allé à un concert',
        subtitle: null,
        sub_question: null,
      },
      {
        id: 'CINEMA',
        // clé factice, pour le dev, voir TODO
        icon: CulturalSurveyIcons.CinemaIcon,
        title: 'Allé au cinéma',
        subtitle: null,
        sub_question: null,
      },
      {
        id: 'MUSEE',
        // clé factice, pour le dev, voir TODO
        icon: CulturalSurveyIcons.MuseumIcon,
        title: 'Visité un musée,',
        subtitle: 'un monument, une exposition...',
        sub_question: null,
      },
      {
        id: 'CONFERENCE',
        // clé factice, pour le dev, voir TODO
        icon: CulturalSurveyIcons.ConferenceIcon,
        title: 'Participé à une conférence,',
        subtitle: 'rencontre ou découverte des métiers de la culture',
        sub_question: null,
      },
      {
        id: 'COURS',
        // clé factice, pour le dev, voir TODO
        icon: CulturalSurveyIcons.BrushIcon,
        title: 'Pris un cours',
        subtitle: 'danse, théâtre, musique, dessin',
        sub_question: null,
      },
      {
        id: 'SANS_SORTIES',
        // clé factice, pour le dev, voir TODO
        icon: undefined,
        title: 'Aucune de ces sorties culturelles',
        subtitle: null,
        sub_question: null,
      },
    ],
  }

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
                  icon={answer?.icon}
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
