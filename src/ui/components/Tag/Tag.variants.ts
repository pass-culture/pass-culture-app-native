import { TagVariant } from 'ui/components/Tag/types'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { CineClubCertification } from 'ui/svg/CineClubCertification'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { Star } from 'ui/svg/Star'

export const variantBackground = {
  [TagVariant.DEFAULT]: 'subtle',
  [TagVariant.SUCCESS]: 'success',
  [TagVariant.WARNING]: 'warning',
  [TagVariant.ERROR]: 'error',
  [TagVariant.NEW]: 'brandPrimary',
  [TagVariant.BOOKCLUB]: 'bookclub',
  [TagVariant.CINECLUB]: 'cineclub',
  [TagVariant.HEADLINE]: 'headline',
  [TagVariant.LIKE]: 'subtle',
  [TagVariant.COMING_SOON]: 'warning',
}

export const variantIconColor = {
  [TagVariant.DEFAULT]: 'default',
  [TagVariant.SUCCESS]: 'success',
  [TagVariant.WARNING]: 'warning',
  [TagVariant.ERROR]: 'error',
  [TagVariant.BOOKCLUB]: 'bookclub',
  [TagVariant.CINECLUB]: 'cineclub',
  [TagVariant.HEADLINE]: 'headline',
  [TagVariant.LIKE]: 'brandPrimary',
  [TagVariant.COMING_SOON]: 'warning',
}

export const variantLabelColor = {
  [TagVariant.NEW]: 'inverted',
}

export const variantIcons = {
  [TagVariant.BOOKCLUB]: BookClubCertification,
  [TagVariant.CINECLUB]: CineClubCertification,
  [TagVariant.HEADLINE]: Star,
  [TagVariant.LIKE]: ThumbUpFilled,
  [TagVariant.COMING_SOON]: ClockFilled,
}
