import React, { FunctionComponent, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { ChronicleCardData } from 'features/chronicle/type'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { TypoDS, getShadow, getSpacing } from 'ui/theme'

const CHRONICLE_THUMBNAIL_SIZE = getSpacing(14)

type Props = PropsWithChildren<
  ChronicleCardData & {
    cardWidth?: number
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
}) => {
  return (
    <Container gap={3} testID={`chronicle-card-${id.toString()}`} width={cardWidth}>
      <InfoHeader
        title={title}
        subtitle={subtitle}
        defaultThumbnailSize={CHRONICLE_THUMBNAIL_SIZE}
        thumbnailComponent={<BookClubCertification />}
      />
      <Separator.Horizontal />
      <Description>{description}</Description>
      <BottomCardContainer>
        <PublicationDate>{date}</PublicationDate>
        {children}
      </BottomCardContainer>
    </Container>
  )
}

const Container = styled(ViewGap)<{ width?: number }>(({ theme, width }) => ({
  padding: getSpacing(6),
  borderRadius: getSpacing(2),
  border: 1,
  borderColor: theme.colors.greyMedium,
  ...(width === undefined ? undefined : { width }),

  backgroundColor: theme.colors.white,
  ...getShadow({
    shadowOffset: { width: 0, height: getSpacing(1) },
    shadowRadius: getSpacing(1),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
}))

const Description = styled(TypoDS.BodyAccentS)(({ theme }) => ({
  color: theme.colors.greyDark,
  flexGrow: 1,
}))

const BottomCardContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const PublicationDate = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
  alignSelf: 'center',
}))
