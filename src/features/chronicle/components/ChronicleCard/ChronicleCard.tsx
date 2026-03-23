import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ChronicleCardBody } from 'features/chronicle/components/ChronicleCardBody/ChronicleCardBody'
import { ChronicleCardData } from 'features/chronicle/type'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/helpers/accessibilityRoleInternalNavigation'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { getSpacing } from 'ui/theme'

const CHRONICLE_THUMBNAIL_HEIGHT = getSpacing(18)

export type ChronicleCardProps = PropsWithChildren<
  ChronicleCardData & {
    cardWidth?: number
    shouldTruncate?: boolean
    icon?: ReactNode
    tag?: ReactNode
  }
>

export const ChronicleCard: FunctionComponent<ChronicleCardProps> = ({
  id,
  title,
  subtitle,
  description,
  date,
  cardWidth,
  children,
  icon,
  tag,
  tagProps,
  image,
  shouldTruncate = false,
  headerNavigateTo,
  headerAccessibilityLabel,
}) => {
  const theme = useTheme()

  const renderHeader = () => (
    <InfoHeader
      title={title}
      subtitle={subtitle}
      thumbnailComponent={image ? <Thumbnail url={image} testID="ChronicleCardThumbnail" /> : icon}
      defaultThumbnailSize={theme.designSystem.size.spacing.xxxxl}
      defaultThumbnailHeight={CHRONICLE_THUMBNAIL_HEIGHT}
      rightComponent={
        headerNavigateTo ? (
          <RightFilled size={theme.icons.sizes.extraSmall} testID="RightFilled" />
        ) : null
      }
    />
  )

  return (
    <Container gap={3} testID={`chronicle-card-${id.toString()}`} width={cardWidth}>
      {headerNavigateTo ? (
        <InternalTouchableLink
          navigateTo={headerNavigateTo}
          accessibilityLabel={headerAccessibilityLabel}
          accessibilityRole={accessibilityRoleInternalNavigation()}>
          {renderHeader()}
        </InternalTouchableLink>
      ) : (
        renderHeader()
      )}

      <ChronicleCardBody
        shouldTruncate={shouldTruncate}
        description={description}
        date={date}
        tag={tagProps ? <Tag variant={tagProps.variant} label={tagProps.label} /> : tag}>
        {children}
      </ChronicleCardBody>
    </Container>
  )
}

const Container = styled(ViewGap)<{ width?: number }>(({ theme, width }) => ({
  padding: theme.designSystem.size.spacing.xl,
  borderRadius: theme.designSystem.size.borderRadius.m,
  border: 1,
  borderColor: theme.designSystem.color.border.subtle,
  ...(width === undefined ? undefined : { width }),
  backgroundColor: theme.designSystem.color.background.default,
}))

const Thumbnail = styled(Image)(({ theme }) => ({
  borderRadius: theme.designSystem.size.borderRadius.s,
  height: getSpacing(18),
  width: theme.designSystem.size.spacing.xxxxl,
  borderColor: theme.designSystem.color.border.subtle,
  borderWidth: 1,
}))
