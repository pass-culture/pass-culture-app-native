import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { TypoDS, getShadow, getSpacing } from 'ui/theme'

const CHRONICLE_THUMBNAIL_SIZE = getSpacing(14)

type ChronicleCardProps = {
  title: string
  subtitle: string
  description: string
  date: string
}

export const ChronicleCard: FunctionComponent<ChronicleCardProps> = ({
  title,
  subtitle,
  description,
  date,
}) => {
  return (
    <Container gap={3}>
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

const Container = styled(ViewGap)(({ theme }) => ({
  padding: getSpacing(6),
  borderRadius: getSpacing(2),
  border: 1,
  borderColor: theme.colors.greyMedium,
  ...getShadow({
    shadowOffset: { width: 0, height: getSpacing(3) },
    shadowRadius: getSpacing(12),
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
