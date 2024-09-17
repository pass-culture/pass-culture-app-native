import React, { useState } from 'react'
import { FlatList, ScrollView, ScrollViewProps, StyleSheet, View, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import {
  SubcategoryButton,
  SubcategoryButtonProps,
  SUBCATEGORY_BUTTON_HEIGHT,
  SUBCATEGORY_BUTTON_WIDTH,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'
import { getSpacing, Spacer } from 'ui/theme'

type StyledScrollViewProps = ScrollViewProps & {
  contentContainerStyle?: ViewStyle
}

type Props = {
  subcategoryButtonContent: SubcategoryButtonProps[]
  scrollViewProps?: StyledScrollViewProps
}

export const SubcategoryButtonList: React.FC<Props> = ({ subcategoryButtonContent }) => {
  const [webViewWidth, setWebViewWidth] = useState<number>(0)

  const { isDesktopViewport } = useTheme()
  const numColumns = Math.max(Math.floor(webViewWidth / SUBCATEGORY_BUTTON_WIDTH), 1)

  const renderItem = ({ item }: { item: SubcategoryButtonProps; index: number }) => (
    <React.Fragment>
      <SubcategoryButton
        label={item.label}
        backgroundColor={item.backgroundColor}
        borderColor={item.borderColor}
        nativeCategory={item.nativeCategory}
      />
      <Spacer.Row numberOfSpaces={4} />
    </React.Fragment>
  )

  if (isDesktopViewport || subcategoryButtonContent.length <= 2) {
    return (
      <View
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout
          setWebViewWidth(width)
        }}>
        <FlatList<SubcategoryButtonProps>
          listAs="ul"
          itemAs="li"
          key={numColumns}
          data={subcategoryButtonContent}
          renderItem={renderItem}
          keyExtractor={(item) => JSON.stringify(item)}
          ItemSeparatorComponent={FlatListLineSpacer}
          numColumns={numColumns}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
    )
  }

  return (
    <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
      {subcategoryButtonContent.map((item, index) => {
        if (index % 2 === 1) return null
        const topContent = subcategoryButtonContent[index]
        const bottomContent = subcategoryButtonContent[index + 1]
        return (
          <React.Fragment key={JSON.stringify([topContent, bottomContent])}>
            <View>
              <Spacer.Row numberOfSpaces={4} />
              {topContent ? <SubcategoryButton {...topContent} /> : null}
              {bottomContent ? (
                <React.Fragment>
                  <Spacer.Column numberOfSpaces={4} />
                  <SubcategoryButton {...bottomContent} />
                </React.Fragment>
              ) : null}
            </View>
            <Spacer.Row numberOfSpaces={4} />
          </React.Fragment>
        )
      })}
    </StyledScrollView>
  )
}

const FlatListLineSpacer = () => <Spacer.Column numberOfSpaces={4} />
const GAP = getSpacing(4)
const PADDING = getSpacing(6)

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingLeft: PADDING,
    paddingVertical: PADDING,
  },
})

const StyledScrollView = styled(ScrollView).attrs<StyledScrollViewProps>({
  contentContainerStyle: {
    paddingLeft: PADDING,
    paddingVertical: PADDING,
    paddingRight: getSpacing(2),
    maxHeight: SUBCATEGORY_BUTTON_HEIGHT * 2 + PADDING * 2 + GAP,
  },
})<StyledScrollViewProps>``
