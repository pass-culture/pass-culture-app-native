import { CulturalSurveyQuestionsResponse } from 'api/gen/api'

export const culturalSurveyQuestionsFixture = {
  questions: [
    {
      id: 'SORTIES',
      title: "Au cours de l'année précédente, tu as/es au moins une fois ...",
      answers: [
        {
          id: 'FESTIVAL',
          title: 'Participé à un festival,',
          subtitle: 'à une avant-première',
          sub_question: 'FESTIVALS',
        },
        {
          id: 'SPECTACLE',
          title: 'Assisté à un spectacle',
          subtitle: 'Pièce de théâtre, cirque, danse...',
          sub_question: 'SPECTACLES',
        },
        {
          id: 'BIBLIOTHEQUE',
          title: 'Allé à la bibliothèque',
          subtitle: 'ou à la médiathèque',
          sub_question: null,
        },
        {
          id: 'EVENEMENT_JEU',
          title: 'Participé à un jeu',
          subtitle: 'escape game, jeu concours',
          sub_question: null,
        },
        {
          id: 'CONCERT',
          title: 'Allé à un concert',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'CINEMA',
          title: 'Allé au cinéma',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'MUSEE',
          title: 'Visité un musée,',
          subtitle: 'un monument, une exposition...',
          sub_question: null,
        },
        {
          id: 'CONFERENCE',
          title: 'Participé à une conférence,',
          subtitle: 'rencontre ou découverte des métiers de la culture',
          sub_question: null,
        },
        {
          id: 'COURS',
          title: 'Pris un cours',
          subtitle: 'danse, théâtre, musique, dessin',
          sub_question: null,
        },
        {
          id: 'SANS_SORTIES',
          title: 'Aucune de ces sorties culturelles',
          subtitle: null,
          sub_question: null,
        },
      ],
    },
    {
      id: 'FESTIVALS',
      title: 'À quels types de festivals as-tu participé\u00a0?',
      answers: [
        {
          id: 'FESTIVAL_MUSIQUE',
          title: 'Festival de musique',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'FESTIVAL_AVANT_PREMIERE',
          title: 'Avant-première de film',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'FESTIVAL_SPECTACLE',
          title: 'Festival de danse, de cirque',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'FESTIVAL_LIVRE',
          title: 'Festival littéraire',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'FESTIVAL_CINEMA',
          title: 'Festival de cinéma',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'FESTIVAL_AUTRE',
          title: 'Autre festival',
          subtitle: null,
          sub_question: null,
        },
      ],
    },
    {
      id: 'SPECTACLES',
      title: 'À quels types de spectacles as-tu assisté\u00a0?',
      answers: [
        {
          id: 'SPECTACLE_HUMOUR',
          title: "Spectacle d'humour",
          subtitle: 'ou café-théâtre',
          sub_question: null,
        },
        {
          id: 'SPECTACLE_THEATRE',
          title: 'Théâtre',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'SPECTACLE_RUE',
          title: 'Spectacle de rue',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'SPECTACLE_OPERA',
          title: 'Comédie musicale, opéra',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'SPECTACLE_CIRQUE',
          title: 'Cirque',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'SPECTACLE_DANSE',
          title: 'Spectacle de danse',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'SPECTACLE_AUTRE',
          title: 'Autres spectacles',
          subtitle: null,
          sub_question: null,
        },
      ],
    },
    {
      id: 'ACTIVITES',
      title: "Au cours de l'année précédente, tu as au moins une fois ...",
      answers: [
        {
          id: 'MATERIEL_ART_CREATIF',
          title: "Utilisé du matériel d'art",
          subtitle: 'pour peindre, dessiner...',
          sub_question: null,
        },
        {
          id: 'PODCAST',
          title: 'Écouté un podcast',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'LIVRE',
          title: 'Lu un livre',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'JOUE_INSTRUMENT',
          title: "Joué d'un instrument de musique ",
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'PRESSE_EN_LIGNE',
          title: 'Lu un article de presse',
          subtitle: 'en ligne',
          sub_question: null,
        },
        {
          id: 'JEU_VIDEO',
          title: 'Joué à un jeu vidéo',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'FILM_DOMICILE',
          title: 'Regardé un film chez toi',
          subtitle: null,
          sub_question: null,
        },
        {
          id: 'SANS_ACTIVITES',
          title: 'Aucune de ces activités culturelles',
          subtitle: null,
          sub_question: null,
        },
      ],
    },
  ],
} as CulturalSurveyQuestionsResponse
