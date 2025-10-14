import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers/category'
import { ImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { getSpacing } from 'ui/theme'

type Props = {
  categoryId: CategoryIdEnum | null
}

// Special case where theme.icons.sizes is not used
const PLACEHOLDER_ICON_SIZE = getSpacing(24)

export const OfferBodyImagePlaceholder: FunctionComponent<Props> = ({ categoryId }) => {
  return (
    <StyledImagePlaceholder Icon={mapCategoryToIcon(categoryId)} size={PLACEHOLDER_ICON_SIZE} />
  )
}

const StyledImagePlaceholder = styled(ImagePlaceholder).attrs(({ theme }) => ({
  borderRadius: theme.designSystem.size.borderRadius.m,
}))({
  position: 'absolute',
})
