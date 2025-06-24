import { TagVariant } from 'ui/components/Tag/types'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { Star } from 'ui/svg/Star'

export const variantBackground = {
  [TagVariant.DEFAULT]: 'subtle',
  [TagVariant.SUCCESS]: 'success',
  [TagVariant.WARNING]: 'warning',
  [TagVariant.ERROR]: 'error',
  [TagVariant.NEW]: 'brandPrimary',
  [TagVariant.BOOKCLUB]: 'bookclub',
  [TagVariant.HEADLINE]: 'headline',
  [TagVariant.LIKE]: 'subtle',
}

export const variantIconColor = {
  [TagVariant.DEFAULT]: 'default',
  [TagVariant.SUCCESS]: 'success',
  [TagVariant.WARNING]: 'warning',
  [TagVariant.ERROR]: 'error',
  [TagVariant.BOOKCLUB]: 'bookclub',
  [TagVariant.HEADLINE]: 'headline',
  [TagVariant.LIKE]: 'brandPrimary',
}

export const variantLabelColor = {
  [TagVariant.NEW]: 'inverted',
}

export const variantIcons = {
  [TagVariant.BOOKCLUB]: BookClubCertification,
  [TagVariant.HEADLINE]: Star,
  [TagVariant.LIKE]: ThumbUpFilled,
}
