import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'

const categoryButtonIllustrationNames = [
  'Book',
  'Camera',
  'Computer',
  'Mic',
  'MusicSheet',
  'Newspaper',
  'Notebook',
  'PaintingPalette',
  'PassCard',
  'Popcorn',
  'Spotlight',
  'Vase',
  'Videogame',
] as const

export type CategoryButtonIllustrationName = (typeof categoryButtonIllustrationNames)[number]

export const categoryButtonIllustrationUrls = {
  Book: buildCategoryIllustrationUrl('book%403x.png'),
  Camera: buildCategoryIllustrationUrl('camera%403x.png'),
  Computer: buildCategoryIllustrationUrl('computer%403x.png'),
  Mic: buildCategoryIllustrationUrl('mic%403x.png'),
  MusicSheet: buildCategoryIllustrationUrl('musicSheet%403x.png'),
  Newspaper: buildCategoryIllustrationUrl('newspaper%403x.png'),
  Notebook: buildCategoryIllustrationUrl('notebook%403x.png'),
  PaintingPalette: buildCategoryIllustrationUrl('paintingPalette%403x.png'),
  PassCard: buildCategoryIllustrationUrl('passCard%403x.png'),
  Popcorn: buildCategoryIllustrationUrl('popcorn%403x.png'),
  Spotlight: buildCategoryIllustrationUrl('spotlight%403x.png'),
  Vase: buildCategoryIllustrationUrl('vase%403x.png'),
  Videogame: buildCategoryIllustrationUrl('videogame%403x.png'),
} as const satisfies Record<CategoryButtonIllustrationName, string>
