import React, { useCallback, useState } from 'react'
import { FlexStyle, LayoutChangeEvent } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useIsLandscape } from 'shared/useIsLandscape/useIsLandscape'
import {
  SubcategoryButton,
  SubcategoryButtonItem,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'

type SubcategoryButtonListProps = {
  subcategoryButtonContent: SubcategoryButtonItem[]
}

export const SubcategoryButtonList: React.FC<SubcategoryButtonListProps> = ({
  subcategoryButtonContent,
}) => {
  const isLandscape = useIsLandscape()
  const theme = useTheme()
  const hasMultipleItems = subcategoryButtonContent.length > 2
  const [maxHeight, setMaxHeight] = useState(0)

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height
    setMaxHeight((prev) => Math.max(prev, height))
  }, [])

  if (theme.isMobileViewport) {
    if (subcategoryButtonContent.length <= 2) {
      return (
        <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SingleRowContainer>
            {subcategoryButtonContent.map((item) => (
              <SubcategoryButton
                key={item.label}
                {...item}
                onLayout={handleLayout}
                uniformHeight={maxHeight > 0 ? maxHeight : undefined}
              />
            ))}
          </SingleRowContainer>
        </StyledScrollView>
      )
    }

    const firstRow = subcategoryButtonContent.filter((_, index) => index % 2 === 0)
    const secondRow = subcategoryButtonContent.filter((_, index) => index % 2 === 1)

    return (
      <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
        <RowsContainer>
          <Row>
            {firstRow.map((item) => (
              <SubcategoryButton
                key={item.label}
                {...item}
                onLayout={handleLayout}
                uniformHeight={maxHeight > 0 ? maxHeight : undefined}
              />
            ))}
          </Row>
          <Row>
            {secondRow.map((item) => (
              <SubcategoryButton
                key={item.label}
                {...item}
                onLayout={handleLayout}
                uniformHeight={maxHeight > 0 ? maxHeight : undefined}
              />
            ))}
          </Row>
        </RowsContainer>
      </StyledScrollView>
    )
  }

  return (
    <StyledScrollView
      horizontal={hasMultipleItems || isLandscape}
      showsHorizontalScrollIndicator={false}>
      {subcategoryButtonContent.map((item) => (
        <SubcategoryButton
          key={item.label}
          {...item}
          onLayout={handleLayout}
          uniformHeight={maxHeight > 0 ? maxHeight : undefined}
        />
      ))}
    </StyledScrollView>
  )
}

const SingleRowContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.designSystem.size.spacing.l,
  padding: theme.designSystem.size.spacing.xl,
}))

const RowsContainer = styled.View(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.designSystem.size.spacing.l,
  padding: theme.designSystem.size.spacing.xl,
}))

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.designSystem.size.spacing.l,
}))

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: theme.isMobileViewport
    ? undefined
    : {
        width: '100%',
        display: 'grid' as FlexStyle['display'],
        gridTemplateColumns: `repeat(${theme.isTabletViewport ? 4 : 5}, 1fr)`,
        padding: theme.designSystem.size.spacing.xl,
        gap: theme.designSystem.size.spacing.l,
      },
}))``
