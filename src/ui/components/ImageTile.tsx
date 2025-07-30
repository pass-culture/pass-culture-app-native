import React, { useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers/category'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { ImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { getSpacing } from 'ui/theme'

interface Props {
  width: number
  height: number
  uri?: string
  onlyTopBorderRadius?: boolean
  categoryId?: CategoryIdEnum | null
}

// Special case where theme.icons.sizes is not used
const PLACEHOLDER_ICON_SIZE = getSpacing(16)

export const ImageTile: React.FC<Props> = (props) => {
  const { designSystem } = useTheme()
  const style = useMemo(
    () => ({
      height: props.height,
      width: props.width,
      ...(props.onlyTopBorderRadius
        ? {
            borderTopLeftRadius: designSystem.size.borderRadius.m,
            borderTopRightRadius: designSystem.size.borderRadius.m,
          }
        : { borderRadius: designSystem.size.borderRadius.m }),
    }),
    [props.height, props.width, props.onlyTopBorderRadius, designSystem.size.borderRadius.m]
  )

  return props.uri ? (
    <StyledFastImage
      style={style}
      url={props.uri}
      height={props.height}
      width={props.width}
      testID="tileImage"
    />
  ) : (
    <DefaultImageContainer height={props.height} width={props.width}>
      <StyledImagePlaceholder
        onlyTopBorderRadius={props.onlyTopBorderRadius ?? false}
        Icon={mapCategoryToIcon(props.categoryId ?? null)}
        size={PLACEHOLDER_ICON_SIZE}
      />
    </DefaultImageContainer>
  )
}

const StyledFastImage = styled(FastImage)(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.subtle,
}))

const DefaultImageContainer = styled.View<{ height: number; width: number }>(
  ({ height, width }) => ({
    height,
    width,
  })
)

const StyledImagePlaceholder = styled(ImagePlaceholder)<{
  onlyTopBorderRadius: boolean
}>(({ theme, onlyTopBorderRadius }) => ({
  borderRadius: onlyTopBorderRadius ? 0 : theme.designSystem.size.borderRadius.m,
  borderTopLeftRadius: theme.designSystem.size.borderRadius.m,
  borderTopRightRadius: theme.designSystem.size.borderRadius.m,
}))
