type Achievement = {
  id: string
  name: string
  description: string
  category: string
  icon: string
}

type UserAchievement = {
  id: string
  completedAt: Date
}

export const achievements: Achievement[] = [
  {
    id: 'FIRST_ADD_FAVORITE',
    name: 'Ajout d’un favori',
    description: 'Tu as mis une offre en favoris pour la première fois\u00a0!',
    category: 'Tutoriel',
    icon: 'Heart',
  },
  {
    id: 'SECOND_ADD_FAVORITE',
    name: 'Second favorite',
    description: 'Add your second favorite',
    category: 'Tutoriel',
    icon: 'Profile',
  },
  {
    id: 'THIRD_ADD_FAVORITE',
    name: 'Third favorite',
    description: 'Add your third favorite',
    category: 'Tutoriel',
    icon: 'Welcome',
  },
  {
    id: '0',
    name: 'Third favorite',
    description: 'Add your third favorite',
    category: 'Tutoriel',
    icon: 'Info',
  },

  {
    id: 'SECOND_WATCH_MOVIE',
    name: 'First movie',
    description: 'Watch your first movie',
    category: 'Découvre le catalogue',
    icon: 'TwoIsBetter',
  },
  {
    id: 'FIRST_WATCH_MOVIE',
    name: 'Second movie',
    description: 'Watch your second movie',
    category: 'Découvre le catalogue',
    icon: 'Opera',
  },
  {
    id: 'THIRD_WATCH_MOVIE',
    name: 'Premier festival',
    description: 'Tu as participé à ton premier festival\u00a0!',
    category: 'Découvre le catalogue',
    icon: 'Festival',
  },

  {
    id: '1',
    name: 'Second movie',
    description: 'Watch your second movie',
    category: 'Activité',
    icon: 'Festival',
  },
  {
    id: '2',
    name: 'Third movie',
    description: 'Watch your third movie',
    category: 'Activité',
    icon: 'Fidelity',
  },

  {
    id: '3',
    name: 'Second movie',
    description: 'Watch your second movie',
    category: 'Évènements',
    icon: 'Opera',
  },
  {
    id: '4',
    name: 'Third movie',
    description: 'Watch your third movie',
    category: 'Évènements',
    icon: 'Profile',
  },
  {
    id: '5',
    name: 'Third movie',
    description: 'Watch your third movie',
    category: 'Évènements',
    icon: 'Profile',
  },
  {
    id: '6',
    name: 'Third movie',
    description: 'Watch your third movie',
    category: 'Évènements',
    icon: 'Profile',
  },
]

export const completedAchievements: UserAchievement[] = [
  { id: 'FIRST_ADD_FAVORITE', completedAt: new Date() },
]

export const badges = [
  {
    achievements: [
      {
        description: 'Tu as mis une offre en favoris pour la première fois\u00a0!',
        icon: 'Heart',
        id: 'FIRST_ADD_FAVORITE',
        isCompleted: true,
        name: 'Ajout d’un favori',
      },
      {
        description: 'Add your second favorite',
        icon: 'Profile',
        id: 'SECOND_ADD_FAVORITE',
        isCompleted: false,
        name: 'Second favorite',
      },
      {
        description: 'Add your third favorite',
        icon: 'Welcome',
        id: 'THIRD_ADD_FAVORITE',
        isCompleted: false,
        name: 'Third favorite',
      },
      {
        description: 'Add your third favorite',
        icon: 'Info',
        id: '0',
        isCompleted: false,
        name: 'Third favorite',
      },
    ],
    category: 'Tutoriel',
    progress: 0.25,
    progressText: '25%',
    remainingAchievements: 3,
  },
  {
    achievements: [
      {
        description: 'Watch your first movie',
        icon: 'TwoIsBetter',
        id: 'SECOND_WATCH_MOVIE',
        isCompleted: false,
        name: 'First movie',
      },
      {
        description: 'Watch your second movie',
        icon: 'Opera',
        id: 'FIRST_WATCH_MOVIE',
        isCompleted: false,
        name: 'Second movie',
      },
      {
        description: 'Tu as participé à ton premier festival\u00a0!',
        icon: 'Festival',
        id: 'THIRD_WATCH_MOVIE',
        isCompleted: false,
        name: 'Premier festival',
      },
    ],
    category: 'Découvre le catalogue',
    progress: 0,
    progressText: '0%',
    remainingAchievements: 3,
  },
  {
    achievements: [
      {
        description: 'Watch your second movie',
        icon: 'Festival',
        id: '1',
        isCompleted: false,
        name: 'Second movie',
      },
      {
        description: 'Watch your third movie',
        icon: 'Fidelity',
        id: '2',
        isCompleted: false,
        name: 'Third movie',
      },
    ],
    category: 'Activité',
    progress: 0,
    progressText: '0%',
    remainingAchievements: 2,
  },
  {
    achievements: [
      {
        description: 'Watch your second movie',
        icon: 'Opera',
        id: '3',
        isCompleted: false,
        name: 'Second movie',
      },
      {
        description: 'Watch your third movie',
        icon: 'Profile',
        id: '4',
        isCompleted: false,
        name: 'Third movie',
      },
      {
        description: 'Watch your third movie',
        icon: 'Profile',
        id: '5',
        isCompleted: false,
        name: 'Third movie',
      },
      {
        description: 'Watch your third movie',
        icon: 'Profile',
        id: '6',
        isCompleted: false,
        name: 'Third movie',
      },
    ],
    category: 'Évènements',
    progress: 0,
    progressText: '0%',
    remainingAchievements: 4,
  },
]
