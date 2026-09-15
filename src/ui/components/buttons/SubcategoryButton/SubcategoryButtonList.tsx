import React, { useCallback, useState } from 'react'
import { FlexStyle, LayoutChangeEvent, ScrollView, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { getSubcategoryLabelParts } from 'features/search/helpers/getSubcategoryLabelParts/getSubcategoryLabelParts'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { NewSubcategoryButton } from 'ui/components/buttons/SubcategoryButton/NewSubcategoryButton'
import {
  SubcategoryButton,
  SubcategoryButtonItem,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'
import { Li } from 'ui/components/Li'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Ul } from 'ui/components/Ul'
import { Button } from 'ui/designSystem/Button/Button'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

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
  const theme = useTheme()
  const enableNewSubcategoryBlocks = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_NEW_CATEGORY_BLOCKS_HOME
  )

  const SubcategoryButtonComponent = enableNewSubcategoryBlocks
    ? NewSubcategoryButton
    : SubcategoryButton

  const shouldDisplaySeeAllButton =
    !!theme.isMobileViewport && subcategoryButtonContent.length > 4 && !!seeAllNavigateTo
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <SingleRowContainer>
              {subcategoryButtonContent.map((item) => (
                <SubcategoryButtonComponent
                  key={item.label}
                  {...item}
                  onLayout={handleLayout}
                  uniformHeight={maxHeight > 0 ? maxHeight : undefined}
                  labelParts={getSubcategoryLabelParts(item.label)}
                />
              ))}
            </SingleRowContainer>
          </ScrollView>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <RowsContainer>
            <Row>
              {firstRow.map((item) => (
                <SubcategoryButtonComponent
                  key={item.label}
                  {...item}
                  onLayout={handleLayout}
                  uniformHeight={maxHeight > 0 ? maxHeight : undefined}
                  labelParts={getSubcategoryLabelParts(item.label)}
                />
              ))}
            </Row>
            <Row>
              {secondRow.map((item) => (
                <SubcategoryButtonComponent
                  key={item.label}
                  {...item}
                  onLayout={handleLayout}
                  uniformHeight={maxHeight > 0 ? maxHeight : undefined}
                  labelParts={getSubcategoryLabelParts(item.label)}
                />
              ))}
            </Row>
          </RowsContainer>
        </ScrollView>
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
      <StyledUl>
        {subcategoryButtonContent.map((item) => (
          <Li key={item.label}>
            <SubcategoryButtonComponent
              {...item}
              onLayout={handleLayout}
              uniformHeight={maxHeight > 0 ? maxHeight : undefined}
              labelParts={getSubcategoryLabelParts(item.label)}
            />
          </Li>
        ))}
      </StyledUl>
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
    <Typo.Title4 {...setTextSemantic('h2')}>Tout parcourir</Typo.Title4>
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

const StyledUl = styled(Ul)(({ theme }) => ({
  width: '100%',
  display: 'grid' as FlexStyle['display'],
  gridTemplateColumns: `repeat(${theme.isTabletViewport ? 4 : 5}, 1fr)`,
  padding: theme.designSystem.size.spacing.xl,
  gap: theme.designSystem.size.spacing.l,
}))
