export type Achievement = {
  id: AchievementId
  name: string
  description: string
  icon: string
  category: AchievementCategory
}

export type UserAchievement = {
  id: AchievementId
  completedAt: Date
}

export enum AchievementId {
  FIRST_MOVIE_BOOKING = 'FIRST_MOVIE_BOOKING',
  FIRST_BOOK_BOOKING = 'FIRST_BOOK_BOOKING',
  FIRST_RECORDED_MUSIC_BOOKING = 'FIRST_RECORDED_MUSIC_BOOKING',
  FIRST_SHOW_BOOKING = 'FIRST_SHOW_BOOKING',
  FIRST_MUSEUM_BOOKING = 'FIRST_MUSEUM_BOOKING',
  FIRST_LIVE_MUSIC_BOOKING = 'FIRST_LIVE_MUSIC_BOOKING',
  FIRST_NEWS_BOOKING = 'FIRST_NEWS_BOOKING',
  FIRST_INSTRUMENT_BOOKING = 'FIRST_INSTRUMENT_BOOKING',
  FIRST_ART_LESSON_BOOKING = 'FIRST_ART_LESSON_BOOKING',
  TEST = 'TEST',
}

export enum AchievementCategory {
  FIRST_BOOKINGS = 'FIRST_BOOKINGS',
  TEST = 'TEST',
}

export const firstMovieBooking = {
  id: AchievementId.FIRST_MOVIE_BOOKING,
  name: 'Cinéphile en herbe',
  description: 'Réserve ta première place de cinéma',
  icon: 'Heart',
  category: AchievementCategory.FIRST_BOOKINGS,
}
export const firstBookBooking = {
  id: AchievementId.FIRST_BOOK_BOOKING,
  name: 'Rat de bibliothèque',
  description: 'Réserve ton premier livre',
  icon: 'Heart',
  category: AchievementCategory.FIRST_BOOKINGS,
}
const firstRecordedMusicBooking = {
  id: AchievementId.FIRST_RECORDED_MUSIC_BOOKING,
  name: 'Premier tour de platine',
  description: 'Réserve ton premier CD ou vinyle',
  icon: 'Heart',
  category: AchievementCategory.FIRST_BOOKINGS,
}
const firstShowBooking = {
  id: AchievementId.FIRST_SHOW_BOOKING,
  name: 'Rideau rouge levé',
  description: 'Réserve ton premier spectacle',
  icon: 'Heart',
  category: AchievementCategory.FIRST_BOOKINGS,
}
const firstMuseumBooking = {
  id: AchievementId.FIRST_MUSEUM_BOOKING,
  name: 'Explorateur culturel',
  description: 'Réserve ta première visite',
  icon: 'Heart',
  category: AchievementCategory.FIRST_BOOKINGS,
}
const firstLiveMusicBooking = {
  id: AchievementId.FIRST_LIVE_MUSIC_BOOKING,
  name: 'Premier Beat',
  description: 'Réserve ton premier concert ou festival',
  icon: 'Heart',
  category: AchievementCategory.FIRST_BOOKINGS,
}
const firstNewsBooking = {
  id: AchievementId.FIRST_NEWS_BOOKING,
  name: 'Futur Hugo Décrypte',
  description: 'Abonne-toi à un média',
  icon: 'Heart',
  category: AchievementCategory.FIRST_BOOKINGS,
}
export const firstInstrumentBooking = {
  id: AchievementId.FIRST_INSTRUMENT_BOOKING,
  name: 'Artiste en devenir',
  description: 'Réserve du matériel créatif',
  icon: 'Heart',
  category: AchievementCategory.FIRST_BOOKINGS,
}
export const firstArtLessonBooking = {
  id: AchievementId.FIRST_ART_LESSON_BOOKING,
  name: 'Se mettre à la pratique',
  description: 'Réserve ton premier atelier ou cours artistique',
  icon: 'Heart',
  category: AchievementCategory.FIRST_BOOKINGS,
}

export const mockAchievements: Achievement[] = [
  firstMovieBooking,
  firstBookBooking,
  firstRecordedMusicBooking,
  firstShowBooking,
  firstMuseumBooking,
  firstLiveMusicBooking,
  firstNewsBooking,
  firstInstrumentBooking,
  firstArtLessonBooking,
]

export const userCompletedMovieBooking = {
  id: AchievementId.FIRST_MOVIE_BOOKING,
  completedAt: new Date(),
}
export const userCompletedBookBooking = {
  id: AchievementId.FIRST_BOOK_BOOKING,
  completedAt: new Date(),
}
export const userCompletedArtLessonBooking = {
  id: AchievementId.FIRST_ART_LESSON_BOOKING,
  completedAt: new Date(),
}

export const mockCompletedAchievements: UserAchievement[] = [
  userCompletedMovieBooking,
  userCompletedBookBooking,
  userCompletedArtLessonBooking,
]
