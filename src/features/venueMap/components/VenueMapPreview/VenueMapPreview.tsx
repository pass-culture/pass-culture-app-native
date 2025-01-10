import React, { ComponentProps, FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Image } from 'libs/resizing-image-on-demand/Image'
import { styledButton } from 'ui/components/buttons/styledButton'
import { CloseButton } from 'ui/components/headers/CloseButton'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { getShadow, getSpacing, Spacer } from 'ui/theme'

type Props = {
  venueName: string
  address: string
  bannerUrl: string
  tags: string[]
  onClose?: VoidFunction
  noBorder?: boolean
  iconSize?: number
  withRightArrow?: boolean
} & ComponentProps<typeof InternalTouchableLink>

const VENUE_THUMBNAIL_SIZE = getSpacing(12)

export const VenueMapPreview: FunctionComponent<Props> = ({
  venueName,
  address,
  bannerUrl,
  tags,
  onClose,
  iconSize,
  noBorder,
  withRightArrow,
  ...touchableProps
}) => {
  const theme = useTheme()
  const Wrapper = noBorder ? InternalTouchableLink : Container
  return (
    <Wrapper {...touchableProps}>
      <Row>
        <StyledInformationTags tags={tags} />
        <StyledCloseButton onClose={onClose} size={iconSize} />
      </Row>
      <Spacer.Column numberOfSpaces={2} />
      <InfoHeader
        title={venueName}
        subtitle={address}
        defaultThumbnailSize={VENUE_THUMBNAIL_SIZE}
        rightComponent={
          withRightArrow ? (
            <RightFilled size={theme.icons.sizes.extraSmall} testID="RightFilled" />
          ) : null
        }
        thumbnailComponent={
          bannerUrl ? (
            <VenueThumbnail
              url={bannerUrl}
              height={VENUE_THUMBNAIL_SIZE}
              width={VENUE_THUMBNAIL_SIZE}
              testID="VenuePreviewImage"
            />
          ) : null
        }
      />
    </Wrapper>
  )
}

const Container = styled(InternalTouchableLink)(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  borderColor: theme.colors.greyDark,
  borderWidth: 1,
  padding: getSpacing(4),
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(1),
    },
    shadowRadius: getSpacing(4),
    shadowColor: theme.colors.secondaryDark,
    shadowOpacity: 0.2,
  }),
}))

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const StyledCloseButton = styledButton(CloseButton)({
  justifyContent: 'flex-start',
})

const StyledInformationTags = styled(InformationTags)({
  flexGrow: 1,
})

const VenueThumbnail = styled(Image)<{ height: number; width: number }>(({ height, width }) => ({
  borderRadius: 4,
  height,
  width,
}))
