import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AdviceCardBody } from 'features/advices/components/AdviceCardBody/AdviceCardBody'
import { AdviceCardData } from 'features/advices/types'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/helpers/accessibilityRoleInternalNavigation'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { getSpacing } from 'ui/theme'

const ADVICE_THUMBNAIL_HEIGHT = getSpacing(18)

export type AdviceCardProps = PropsWithChildren<
  AdviceCardData & {
    cardWidth?: number
    shouldTruncate?: boolean
    icon?: ReactNode
    tag?: ReactNode
  }
>

export const AdviceCard: FunctionComponent<AdviceCardProps> = ({
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
      thumbnailComponent={image ? <Thumbnail url={image} testID="AdviceCardThumbnail" /> : icon}
      defaultThumbnailSize={theme.designSystem.size.spacing.xxxxl}
      defaultThumbnailHeight={ADVICE_THUMBNAIL_HEIGHT}
      rightComponent={
        headerNavigateTo ? (
          <RightFilled size={theme.icons.sizes.extraSmall} testID="RightFilled" />
        ) : null
      }
    />
  )

  return (
    <Container gap={3} testID={`advice-card-${id.toString()}`} width={cardWidth}>
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

      <AdviceCardBody
        shouldTruncate={shouldTruncate}
        description={description}
        date={date}
        tag={tagProps ? <Tag variant={tagProps.variant} label={tagProps.label} /> : tag}>
        {children}
      </AdviceCardBody>
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
