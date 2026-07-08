import React, { useCallback, useState } from 'react'
import { FlexStyle, LayoutChangeEvent, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useIsLandscape } from 'shared/useIsLandscape/useIsLandscape'
import {
  SubcategoryButton,
  SubcategoryButtonItem,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Button } from 'ui/designSystem/Button/Button'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type SubcategoryButtonListProps = {
  subcategoryButtonContent: SubcategoryButtonItem[]
  seeAllNavigateTo?: InternalNavigationProps['navigateTo']
  onBeforeSeeAllNavigate?: VoidFunction
}

export const SubcategoryButtonList: React.FC<SubcategoryButtonListProps> = ({
  subcategoryButtonContent,
  seeAllNavigateTo,
  onBeforeSeeAllNavigate,
}) => {
  const isLandscape = useIsLandscape()
  const theme = useTheme()
  const hasMultipleItems = subcategoryButtonContent.length > 2
  const shouldDisplaySeeAllButton = Boolean(
    theme.isMobileViewport && subcategoryButtonContent.length > 4 && !!seeAllNavigateTo
  )
  const [maxHeight, setMaxHeight] = useState(0)

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height
    setMaxHeight((prev) => Math.max(prev, height))
  }, [])

  if (theme.isMobileViewport) {
    if (subcategoryButtonContent.length <= 2) {
      return (
        <View>
          <Header
            shouldDisplaySeeAllButton={shouldDisplaySeeAllButton}
            seeAllNavigateTo={seeAllNavigateTo}
            onBeforeSeeAllNavigate={onBeforeSeeAllNavigate}
          />
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
        </View>
      )
    }

    const firstRow = subcategoryButtonContent.filter((_, index) => index % 2 === 0)
    const secondRow = subcategoryButtonContent.filter((_, index) => index % 2 === 1)

    return (
      <View>
        <Header
          shouldDisplaySeeAllButton={shouldDisplaySeeAllButton}
          seeAllNavigateTo={seeAllNavigateTo}
          onBeforeSeeAllNavigate={onBeforeSeeAllNavigate}
        />
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
      </View>
    )
  }

  return (
    <View>
      <Header
        shouldDisplaySeeAllButton={false}
        seeAllNavigateTo={seeAllNavigateTo}
        onBeforeSeeAllNavigate={onBeforeSeeAllNavigate}
      />
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
    </View>
  )
}

type HeaderProps = {
  shouldDisplaySeeAllButton: boolean
  seeAllNavigateTo?: InternalNavigationProps['navigateTo']
  onBeforeSeeAllNavigate?: VoidFunction
}

const Header = ({
  shouldDisplaySeeAllButton,
  seeAllNavigateTo,
  onBeforeSeeAllNavigate,
}: HeaderProps) => (
  <HeaderContainer>
    <Typo.Title4 {...getHeadingAttrs(2)}>Tout parcourir</Typo.Title4>
    {shouldDisplaySeeAllButton && seeAllNavigateTo ? (
      <InternalTouchableLink
        as={Button}
        navigateTo={seeAllNavigateTo}
        onBeforeNavigate={onBeforeSeeAllNavigate}
        wording="Voir tout"
        variant="tertiary"
        size="small"
        accessibilityLabel="Voir tout pour la sélection Tout parcourir"
      />
    ) : null}
  </HeaderContainer>
)

const HeaderContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.designSystem.size.spacing.m,
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginTop: theme.designSystem.size.spacing.xl,
}))

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
