import React, { useEffect, useRef } from 'react'
import { FlatList, FlatListProps, ListRenderItemInfo, Platform, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { AbsoluteRoundedButton } from 'ui/components/buttons/AbsoluteRoundedButton'
import { useHorizontalFlatListScroll } from 'ui/hooks/useHorizontalFlatListScroll'
import { useLayout } from 'ui/hooks/useLayout'
import { getSpacing } from 'ui/theme'

type ArrowFlatListProps<T> = FlatListProps<T> & {
  displayFadeBackground?: boolean
}

export const ArrowFlatList = <T,>({
  renderItem,
  displayFadeBackground = true,
  ...props
}: ArrowFlatListProps<T>) => {
  const listRef = useRef<FlatList<T>>(null)
  const isWeb = Platform.OS === 'web'
  const { width: flatListWidth, onLayout: onFlatListLayout } = useLayout()
  const { width: itemWidth, onLayout: onItemLayout } = useLayout()

  const layoutRef = useRef({ flatListWidth, itemWidth })

  useEffect(() => {
    layoutRef.current = { flatListWidth, itemWidth }
  }, [flatListWidth, itemWidth])

  const {
    handleScrollPrevious,
    handleScrollNext,
    onScroll,
    onContentSizeChange,
    onContainerLayout,
    isEnd,
    isStart,
  } = useHorizontalFlatListScroll({
    ref: listRef,
    isActive: isWeb,
  })

  const renderItemWrapper = (renderItemProps: ListRenderItemInfo<T>) => (
    <View onLayout={onItemLayout}>{renderItem?.({ ...renderItemProps })}</View>
  )

  return (
    <View onLayout={onContainerLayout}>
      {isStart ? null : (
        <ArrowWrapper>
          {displayFadeBackground ? <FadeLeft /> : null}
          <AbsoluteRoundedButton
            direction="left"
            iconName="previous"
            onPress={handleScrollPrevious}
            accessibilityLabel="Faire défiler la liste vers la gauche"
            testID="flat-list-left-arrow"
          />
        </ArrowWrapper>
      )}
      <FlatList
        onLayout={(event) => {
          props.onLayout?.(event)
          onFlatListLayout(event)
        }}
        ref={listRef}
        onScroll={onScroll}
        renderItem={renderItemWrapper}
        onContentSizeChange={onContentSizeChange}
        {...props}
      />
      {isEnd ? null : (
        <ArrowWrapper>
          {displayFadeBackground ? <FadeRight /> : null}
          <AbsoluteRoundedButton
            direction="right"
            iconName="next"
            onPress={handleScrollNext}
            accessibilityLabel="Faire défiler la liste vers la droite"
            testID="flat-list-right-arrow"
          />
        </ArrowWrapper>
      )}
    </View>
  )
}

const ArrowWrapper = styled.View.attrs({
  pointerEvents: 'box-none',
})({
  zIndex: 2,
  height: '100%',
  position: 'absolute',
  width: '100%',
  justifyContent: 'center',
})

const FadeComponent = styled(LinearGradient).attrs({
  pointerEvents: 'none',
})(
  ({ theme }) => `
  position: absolute;
  top: 0;
  bottom: ${theme.designSystem.size.spacing.xs}px;
  width: ${getSpacing(20)}px;
`
)

const FadeLeft = styled(FadeComponent).attrs<{ colors?: string[] }>(({ theme }) => ({
  colors: [
    theme.designSystem.color.background.gradientMaximum,
    theme.designSystem.color.background.gradientMinimum,
  ],
  start: { x: 0.2, y: 0.5 },
  end: { x: 1, y: 0.5 },
}))`
  left: -1px;
`

const FadeRight = styled(FadeComponent).attrs<{ colors?: string[] }>(({ theme }) => ({
  colors: [
    theme.designSystem.color.background.gradientMinimum,
    theme.designSystem.color.background.gradientMaximum,
  ],
  start: { x: 0, y: 0.5 },
  end: { x: 0.8, y: 0.5 },
}))`
  right: -1px;
`
