import { ArrowLeftNew } from 'ui/svg/icons/ArrowLeftNew'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ArrowRightNew } from 'ui/svg/icons/ArrowRightNew'
import { Favorite } from 'ui/svg/icons/Favorite'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'
import { Share } from 'ui/svg/icons/Share'
import { ThumbDown } from 'ui/svg/icons/ThumbDown'
import { ThumbDownFilled } from 'ui/svg/icons/ThumbDownFilled'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { AccessibleIcon } from 'ui/svg/icons/types'

export type IconNames =
  | 'back'
  | 'share'
  | 'favorite'
  | 'favorite-filled'
  | 'next'
  | 'previous'
  | 'like'
  | 'like-filled'
  | 'dislike'
  | 'dislike-filled'

export type IconFactory = { getIcon(iconName?: IconNames): React.FC<AccessibleIcon> }

const iconMapping: Record<IconNames, React.FC<AccessibleIcon>> = {
  back: ArrowPrevious,
  next: ArrowRightNew,
  previous: ArrowLeftNew,
  share: Share,
  'favorite-filled': FavoriteFilled,
  favorite: Favorite,
  like: ThumbUp,
  'like-filled': ThumbUpFilled,
  dislike: ThumbDown,
  'dislike-filled': ThumbDownFilled,
}

export const iconFactory: IconFactory = {
  getIcon(name: IconNames) {
    return iconMapping[name]
  },
}
