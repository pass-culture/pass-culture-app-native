type Achievement = {
  id: AchievementID
  name: string
  description: string
  icon: string
  category: AchievementCategory
}

type UserAchievement = {
  id: AchievementID
  completedAt: Date
}

enum AchievementID {
  FIRST_BOOKING_MOVIE = 'FIRST_BOOKING_MOVIE',
  FIRST_BOOKING_BOOK = 'FIRST_BOOKING_BOOK',
  FIRST_BOOKING_RECORDED_MUSIC = 'FIRST_BOOKING_RECORDED_MUSIC',
  FIRST_BOOKING_SHOW = 'FIRST_BOOKING_SHOW',
  FIRST_BOOKING_MUSEUM = 'FIRST_BOOKING_MUSEUM',
  FIRST_BOOKING_LIVE_MUSIC = 'FIRST_BOOKING_LIVE_MUSIC',
  FIRST_BOOKING_MEDIA = 'FIRST_BOOKING_MEDIA',
  FIRST_BOOKING_INSTRUMENT = 'FIRST_BOOKING_INSTRUMENT',
  FIRST_BOOKING_ART = 'FIRST_BOOKING_ART',
}

enum AchievementCategory {
  FIRST_BOOKINGS = 'FIRST_BOOKINGS',
}

export const achievements: Achievement[] = [
  {
    id: AchievementID.FIRST_BOOKING_MOVIE,
    name: 'Cinéphile en herbe',
    description: 'Réserve ta première place de cinéma',
    icon: 'Heart',
    category: AchievementCategory.FIRST_BOOKINGS,
  },
  {
    id: AchievementID.FIRST_BOOKING_BOOK,
    name: 'Rat de bibliothèque',
    description: 'Réserve ton premier livre',
    icon: 'Heart',
    category: AchievementCategory.FIRST_BOOKINGS,
  },
  {
    id: AchievementID.FIRST_BOOKING_RECORDED_MUSIC,
    name: 'Premier tour de platine',
    description: 'Réserve ton premier CD ou vinyle',
    icon: 'Heart',
    category: AchievementCategory.FIRST_BOOKINGS,
  },
  {
    id: AchievementID.FIRST_BOOKING_SHOW,
    name: 'Rideau rouge levé',
    description: 'Réserve ton premier spectacle',
    icon: 'Heart',
    category: AchievementCategory.FIRST_BOOKINGS,
  },
  {
    id: AchievementID.FIRST_BOOKING_MUSEUM,
    name: 'Explorateur culturel',
    description: 'Réserve ta première visite',
    icon: 'Heart',
    category: AchievementCategory.FIRST_BOOKINGS,
  },
  {
    id: AchievementID.FIRST_BOOKING_LIVE_MUSIC,
    name: 'Premier Beat',
    description: 'Réserve ton premier concert ou festival',
    icon: 'Heart',
    category: AchievementCategory.FIRST_BOOKINGS,
  },
  {
    id: AchievementID.FIRST_BOOKING_MEDIA,
    name: 'Futur Hugo Décrypte',
    description: 'Abonne-toi à un média',
    icon: 'Heart',
    category: AchievementCategory.FIRST_BOOKINGS,
  },
  {
    id: AchievementID.FIRST_BOOKING_INSTRUMENT,
    name: 'Artiste en devenir',
    description: 'Réserve du matériel créatif',
    icon: 'Heart',
    category: AchievementCategory.FIRST_BOOKINGS,
  },
  {
    id: AchievementID.FIRST_BOOKING_ART,
    name: 'Se mettre à la pratique',
    description: 'Réserve ton premier atelier ou cours artistique',
    icon: 'Heart',
    category: AchievementCategory.FIRST_BOOKINGS,
  },
]

export const completedAchievements: UserAchievement[] = [
  { id: AchievementID.FIRST_BOOKING_MOVIE, completedAt: new Date() },
]

export const badges = [
  {
    achievements: [
      {
        id: AchievementID.FIRST_BOOKING_MOVIE,
        name: 'Cinéphile en herbe',
        description: 'Réserve ta première place de cinéma',
        icon: 'Heart',
        isCompleted: true,
      },
      {
        id: AchievementID.FIRST_BOOKING_BOOK,
        name: 'Rat de bibliothèque',
        description: 'Réserve ton premier livre',
        icon: 'Heart',
        isCompleted: false,
      },
    ],
    category: AchievementCategory.FIRST_BOOKINGS,
    progress: 0.25,
    progressText: '25%',
    remainingAchievements: 3,
  },
]
