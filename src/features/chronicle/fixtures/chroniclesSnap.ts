import type { ReadonlyDeep } from 'type-fest'

import { ChronicleCardData } from 'features/chronicle/type'
import { toMutable } from 'shared/types/toMutable'

export const chroniclesSnap = toMutable([
  {
    id: 1,
    title: 'Le Voyage Extraordinaire',
    subtitle: 'Explorateur du monde',
    description:
      'Découvrez l’histoire fascinante d’un homme qui a parcouru les coins les plus reculés de la planète.',
    date: 'Janvier 2024',
  },
  {
    id: 2,
    title: 'L’Art de la Cuisine',
    subtitle: 'Chef étoilé',
    description:
      'Plongez dans les secrets de la gastronomie avec un chef qui transforme chaque repas en œuvre d’art.',
    date: 'Février 2024',
  },
  {
    id: 3,
    title: 'Le Futur de la Technologie',
    subtitle: 'Visionnaire du digital',
    description:
      'Une analyse approfondie des innovations qui changeront notre quotidien dans les années à venir.',
    date: 'Mars 2024',
  },
  {
    id: 4,
    title: 'Aventures sous-marines',
    subtitle: 'Plongeur passionné',
    description:
      'Une plongée captivante dans les mystères des océans, révélant une faune et une flore extraordinaires.',
    date: 'Avril 2024',
  },
  {
    id: 5,
    title: 'La Magie des Étoiles',
    subtitle: 'Astrophysicien',
    description:
      'Explorez les confins de l’univers à travers le regard d’un scientifique fasciné par les étoiles.',
    date: 'Mai 2024',
  },
  {
    id: 6,
    title: 'L’Histoire des Civilisations',
    subtitle: 'Historien renommé',
    description:
      'Un voyage dans le temps pour découvrir les grandes civilisations qui ont marqué notre histoire.',
    date: 'Juin 2024',
  },
  {
    id: 7,
    title: 'La Nature Sauvage',
    subtitle: 'Photographe animalier',
    description:
      'Un album photo spectaculaire montrant la beauté brute de la faune et de la flore sauvage.',
    date: 'Juillet 2024',
  },
  {
    id: 8,
    title: 'Les Secrets de l’Univers',
    subtitle: 'Physicien théoricien',
    description:
      'Une exploration des théories qui tentent d’expliquer les origines et le fonctionnement de l’univers.',
    date: 'Août 2024',
  },
  {
    id: 9,
    title: 'Voyage au Centre de la Terre',
    subtitle: 'Géologue explorateur',
    description: 'Une aventure palpitante qui révèle les secrets cachés sous nos pieds.',
    date: 'Septembre 2024',
  },
  {
    id: 10,
    title: 'La Renaissance Artistique',
    subtitle: 'Critique d’art',
    description: 'Un voyage captivant à travers les œuvres emblématiques de la Renaissance.',
    date: 'Octobre 2024',
  },
  {
    id: 11,
    title: 'L’Odyssée des Espèces',
    subtitle: 'Biologiste marin',
    description: 'Un regard fascinant sur l’évolution des espèces marines au fil des âges.',
    date: 'Novembre 2024',
  },
  {
    id: 12,
    title: 'La Quête des Énergies Renouvelables',
    subtitle: 'Ingénieur en énergie',
    description:
      'Un guide pratique pour comprendre les défis et les opportunités des énergies vertes.',
    date: 'Décembre 2024',
  },
  {
    id: 13,
    title: 'Les Mystères de l’Esprit Humain',
    subtitle: 'Psychologue renommé',
    description: 'Une plongée dans les complexités du cerveau et du comportement humain.',
    date: 'Janvier 2025',
  },
  {
    id: 14,
    title: 'Au-Delà des Frontières',
    subtitle: 'Journaliste d’investigation',
    description: 'Un récit poignant sur les luttes et les espoirs des réfugiés à travers le monde.',
    date: 'Février 2025',
  },
  {
    id: 15,
    title: 'L’Énigme des Civilisations Perdues',
    subtitle: 'Archéologue',
    description: 'Une enquête sur les sociétés disparues et leurs traces laissées dans l’histoire.',
    date: 'Mars 2025',
  },
  {
    id: 16,
    title: 'Les Gardiens de la Forêt',
    subtitle: 'Écologiste',
    description: 'Un hommage aux protecteurs des écosystèmes forestiers à travers le globe.',
    date: 'Avril 2025',
  },
] as const satisfies ReadonlyDeep<ChronicleCardData[]>)
