import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ChronicleCardData } from 'features/chronicle/type'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { TypoDS, getShadow, getSpacing } from 'ui/theme'

const CHRONICLE_THUMBNAIL_SIZE = getSpacing(14)

type Props = ChronicleCardData & {
  cardWidth?: number
}

export const ChronicleCard: FunctionComponent<Props> = ({
  id,
  title,
  subtitle,
  description,
  date,
  cardWidth,
}) => {
  return (
    <Container gap={3} testID={`chronicle-${id.toString()}`} maxWidth={cardWidth}>
      <InfoHeader
        title={title}
        subtitle={subtitle}
        defaultThumbnailSize={CHRONICLE_THUMBNAIL_SIZE}
        thumbnailComponent={<BookClubCertification />}
      />
      <Separator.Horizontal />
      <Description>{description}</Description>
      <PublicationDate>{date}</PublicationDate>
    </Container>
  )
}

const Container = styled(ViewGap)<{ maxWidth?: number }>(({ theme, maxWidth }) => ({
  padding: getSpacing(6),
  borderRadius: getSpacing(2),
  border: 1,
  borderColor: theme.colors.greyMedium,
  maxWidth,

  backgroundColor: theme.colors.white,
  ...getShadow({
    shadowOffset: { width: 0, height: getSpacing(1) },
    shadowRadius: getSpacing(6),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
}))

const Description = styled(TypoDS.BodyAccentS)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const PublicationDate = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
