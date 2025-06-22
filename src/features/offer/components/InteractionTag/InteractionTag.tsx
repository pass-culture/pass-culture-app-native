import React, { ReactElement } from 'react'

import { theme } from 'theme'
import { Tag } from 'ui/components/Tag/Tag'
import { TagVariant } from 'ui/components/Tag/types'

type InteractionTagParams = {
  theme: typeof theme
  likesCount?: number
  chroniclesCount?: number
  headlinesCount?: number
  hasSmallLayout?: boolean
  isComingSoonOffer?: boolean
}

type TagProps = {
  label: string
  variant: TagVariant
}

export const renderInteractionTag = (params: InteractionTagParams): ReactElement | undefined => {
  const tagProps = getTagProps(params)
  if (!tagProps) return undefined

  return <Tag testID="interaction-tag" {...tagProps} />
}

export const getTagProps = ({
  likesCount = 0,
  chroniclesCount = 0,
  headlinesCount = 0,
  hasSmallLayout,
  isComingSoonOffer,
}: InteractionTagParams): TagProps | null => {
  if (isComingSoonOffer) {
    return {
      label: hasSmallLayout ? 'Bientôt' : 'Bientôt dispo',
      variant: TagVariant.WARNING,
    }
  }

  if (chroniclesCount > 0) {
    return {
      label: hasSmallLayout ? 'Reco Club' : 'Reco du Club',
      variant: TagVariant.BOOKCLUB,
    }
  }

  if (headlinesCount > 0) {
    return {
      label: hasSmallLayout ? 'Reco lieux' : 'Reco par les lieux',
      variant: TagVariant.HEADLINE,
    }
  }

  if (likesCount > 0) {
    return {
      label: `${likesCount} j’aime`,
      variant: TagVariant.LIKE,
    }
  }

  return null
}
