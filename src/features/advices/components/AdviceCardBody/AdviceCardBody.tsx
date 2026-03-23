import React, { FunctionComponent, PropsWithChildren, ReactNode, useState } from 'react'
import { LayoutChangeEvent, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AdviceCardData } from 'features/advices/types'
import { getLineHeightPx } from 'libs/parsers/getLineHeightPx'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

type Props = PropsWithChildren<
  Pick<AdviceCardData, 'description' | 'date'> & {
    cardWidth?: number
    shouldTruncate?: boolean
    tag?: ReactNode
  }
>

const MAX_LINES = 3

export const AdviceCardBody: FunctionComponent<Props> = ({
  description,
  date,
  cardWidth,
  children,
  tag,
  shouldTruncate = false,
}) => {
  const { designSystem } = useTheme()

  const [currentNumberOfLines, setCurrentNumberOfLines] = useState<number | undefined>(undefined)
  const [shouldDisplayButton, setShouldDisplayButton] = useState(false)

  // height depending on the platform
  const lineHeight = designSystem.typography.bodyAccentS.lineHeight
  const DEFAULT_HEIGHT_WEB = getLineHeightPx(lineHeight, true) * MAX_LINES
  const DEFAULT_HEIGHT_MOBILE = getLineHeightPx(lineHeight, false) * MAX_LINES
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

  const descriptionWithoutEndSpace = description?.trimEnd()

  return (
    <Container gap={3} width={cardWidth}>
      <DescriptionContainer defaultHeight={defaultHeight} shouldTruncate={shouldTruncate}>
        <Typo.BodyS
          testID="description"
          onLayout={shouldTruncate ? handleOnLayout : undefined}
          numberOfLines={currentNumberOfLines}>
          {`«\u00a0${descriptionWithoutEndSpace}\u00a0»`}
        </Typo.BodyS>
      </DescriptionContainer>
      <PublicationDate>{date}</PublicationDate>
      <BottomCardContainer>
        {tag}
        {shouldDisplayButton && children}
      </BottomCardContainer>
    </Container>
  )
}

const Container = styled(ViewGap)<{ width?: number }>(({ theme, width }) => ({
  ...(width === undefined ? undefined : { width }),
  backgroundColor: theme.designSystem.color.background.default,
  flexGrow: 1,
}))

const DescriptionContainer = styled.View<{ defaultHeight: number; shouldTruncate?: boolean }>(
  ({ defaultHeight, shouldTruncate }) =>
    shouldTruncate ? { maxHeight: MAX_LINES * defaultHeight, overflow: 'hidden', flexGrow: 1 } : {}
)

const BottomCardContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const PublicationDate = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
