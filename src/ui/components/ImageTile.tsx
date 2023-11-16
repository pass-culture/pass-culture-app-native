import React, { useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { ImagePlaceholder as DefaultImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { getSpacing } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

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
  const theme = useTheme()
  const style = useMemo(
    () => ({
      height: props.height,
      width: props.width,
      ...(props.onlyTopBorderRadius
        ? {
            borderTopLeftRadius: BorderRadiusEnum.BORDER_RADIUS,
            borderTopRightRadius: BorderRadiusEnum.BORDER_RADIUS,
          }
        : { borderRadius: BorderRadiusEnum.BORDER_RADIUS }),
    }),
    [props.height, props.width, props.onlyTopBorderRadius]
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
      <StyledDefaultImagePlaceholder
        Icon={mapCategoryToIcon(props.categoryId ?? null)}
        backgroundColors={[theme.colors.greyLight, theme.colors.greyMedium]}
        size={PLACEHOLDER_ICON_SIZE}
      />
    </DefaultImageContainer>
  )
}

const StyledFastImage = styled(FastImage)(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
}))

const DefaultImageContainer = styled.View<{ height: number; width: number }>(
  ({ height, width }) => ({
    height,
    width,
  })
)

const StyledDefaultImagePlaceholder = styled(DefaultImagePlaceholder)(({ theme }) => ({
  borderRadius: 0,
  borderTopLeftRadius: theme.borderRadius.radius,
  borderTopRightRadius: theme.borderRadius.radius,
}))
