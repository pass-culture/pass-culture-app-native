import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import styled from 'styled-components/native'

import { ChronicleCardBody } from 'features/chronicle/components/ChronicleCardBody/ChronicleCardBody'
import { ChronicleCardData } from 'features/chronicle/type'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

const CHRONICLE_THUMBNAIL_SIZE = getSpacing(14)

type Props = PropsWithChildren<
  ChronicleCardData & {
    cardWidth?: number
    shouldTruncate?: boolean
    icon?: ReactNode
    tag?: ReactNode
  }
>

export const ChronicleCard: FunctionComponent<Props> = ({
  id,
  title,
  subtitle,
  description,
  date,
  cardWidth,
  children,
  icon,
  tag,
  shouldTruncate = false,
}) => {
  return (
    <Container gap={3} testID={`chronicle-card-${id.toString()}`} width={cardWidth}>
      <InfoHeader
        title={title}
        subtitle={subtitle}
        defaultThumbnailSize={CHRONICLE_THUMBNAIL_SIZE}
        thumbnailComponent={icon}
      />
      <ChronicleCardBody
        shouldTruncate={shouldTruncate}
        description={description}
        date={date}
        tag={tag}>
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
