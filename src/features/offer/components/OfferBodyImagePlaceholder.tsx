import React, { ComponentProps, FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers/category'
import { ImagePlaceholder as DefaultImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { getSpacing } from 'ui/theme'

type Props = {
  categoryId: CategoryIdEnum | null
}

// Special case where theme.icons.sizes is not used
const PLACEHOLDER_ICON_SIZE = getSpacing(24)

export const OfferBodyImagePlaceholder: FunctionComponent<Props> = ({ categoryId }) => {
  const ImagePlaceholder = styled(DefaultImagePlaceholder).attrs(
    ({ theme }): ComponentProps<typeof DefaultImagePlaceholder> => ({
      Icon: mapCategoryToIcon(categoryId),
      borderRadius: theme.borderRadius.radius,
      size: PLACEHOLDER_ICON_SIZE,
    })
  )({
    position: 'absolute',
  })

  return <ImagePlaceholder />
}
