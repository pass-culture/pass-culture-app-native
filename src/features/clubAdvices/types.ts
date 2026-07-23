import {
  BOOK_CLUB_SUBCATEGORIES,
  CINE_CLUB_SUBCATEGORIES,
  SCENE_CLUB_SUBCATEGORIES,
} from 'features/clubAdvices/constants'

export type BookClubSubcategoryId = (typeof BOOK_CLUB_SUBCATEGORIES)[number]

export type CineClubSubcategoryId = (typeof CINE_CLUB_SUBCATEGORIES)[number]

export type SceneClubSubcategoryId = (typeof SCENE_CLUB_SUBCATEGORIES)[number]
