import React, { FunctionComponent, PropsWithChildren, useState } from 'react'
import { LayoutChangeEvent, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ChronicleCardData } from 'features/chronicle/type'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { Typo, getShadow, getSpacing } from 'ui/theme'
import { REM_TO_PX } from 'ui/theme/constants'

const CHRONICLE_THUMBNAIL_SIZE = getSpacing(14)

type Props = PropsWithChildren<
  ChronicleCardData & {
    cardWidth?: number
    shouldTruncate?: boolean
  }
>

const MAX_LINES = 3
const CHRONICLE_CARD_HEIGHT = 220

export const ChronicleCard: FunctionComponent<Props> = ({
  id,
  title,
  subtitle,
  description,
  date,
  cardWidth,
  children,
  shouldTruncate = false,
}) => {
  const theme = useTheme()

  const [currentNumberOfLines, setCurrentNumberOfLines] = useState<number | undefined>(undefined)
  const [shouldDisplayButton, setShouldDisplayButton] = useState(false)

  // height depending on the platform
  const DEFAULT_HEIGHT_WEB =
    parseFloat(theme.designSystem.typography.bodyAccentS.lineHeight) * MAX_LINES * REM_TO_PX
  const DEFAULT_HEIGHT_MOBILE =
    parseFloat(theme.designSystem.typography.bodyAccentS.lineHeight) * MAX_LINES
  const defaultHeight = Platform.OS === 'web' ? DEFAULT_HEIGHT_WEB : DEFAULT_HEIGHT_MOBILE

  const handleOnLayout = (event: LayoutChangeEvent) => {
    // We use Math.floor to avoid floating-point precision issues when comparing heights
    const actualHeight = Math.floor(event.nativeEvent.layout.height)
    const expectedMaxHeight = Math.floor(defaultHeight)

    if (actualHeight > expectedMaxHeight) {
      setShouldDisplayButton(true)
      setCurrentNumberOfLines(3)
    }
  }

  return (
    <Container gap={3} testID={`chronicle-card-${id.toString()}`} width={cardWidth}>
      <InfoHeader
        title={title}
        subtitle={subtitle}
        defaultThumbnailSize={CHRONICLE_THUMBNAIL_SIZE}
        thumbnailComponent={<BookClubIcon />}
      />
      <Separator.Horizontal />
      <DescriptionContainer defaultHeight={defaultHeight} shouldTruncate={shouldTruncate}>
        <Description
          testID="description"
          onLayout={shouldTruncate ? handleOnLayout : undefined}
          numberOfLines={currentNumberOfLines}>
          {description}
        </Description>
      </DescriptionContainer>
      <BottomCardContainer>
        <PublicationDate>{date}</PublicationDate>
        {shouldDisplayButton && children}
      </BottomCardContainer>
    </Container>
  )
}

const Container = styled(ViewGap)<{ width?: number; shouldTruncate?: boolean }>(
  ({ theme, width, shouldTruncate }) => ({
    padding: getSpacing(6),
    borderRadius: getSpacing(2),
    border: 1,
    borderColor: theme.designSystem.color.border.subtle,
    ...(width === undefined ? undefined : { width }),
    height: shouldTruncate ? CHRONICLE_CARD_HEIGHT : undefined,
    backgroundColor: theme.designSystem.color.background.default,
    ...getShadow({
      shadowOffset: { width: 0, height: getSpacing(1) },
      shadowRadius: getSpacing(1),
      shadowColor: theme.colors.black,
      shadowOpacity: 0.15,
    }),
  })
)

const BookClubIcon = styled(BookClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.bookclub,
}))``

const DescriptionContainer = styled.View<{ defaultHeight: number; shouldTruncate?: boolean }>(
  ({ defaultHeight, shouldTruncate }) =>
    shouldTruncate ? { maxHeight: MAX_LINES * defaultHeight, overflow: 'hidden' } : {}
)

const Description = styled(Typo.BodyAccentS)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  flexGrow: 1,
}))

const BottomCardContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const PublicationDate = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  alignSelf: 'center',
}))
