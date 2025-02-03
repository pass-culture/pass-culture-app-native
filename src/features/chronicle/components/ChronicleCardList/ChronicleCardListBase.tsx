import React, {
  ReactElement,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { FlatList, FlatListProps, ListRenderItem, StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ChronicleCardData } from 'features/chronicle/type'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { PlainMore } from 'ui/svg/icons/PlainMore'
import { getSpacing } from 'ui/theme'

import { ChronicleCard } from '../ChronicleCard/ChronicleCard'

export const SEPARATOR_DEFAULT_VALUE = 2

const keyExtractor = (item: ChronicleCardData) => item.id.toString()

export type ChronicleCardListProps = Pick<
  FlatListProps<ChronicleCardData>,
  | 'data'
  | 'contentContainerStyle'
  | 'horizontal'
  | 'snapToInterval'
  | 'onScroll'
  | 'onContentSizeChange'
  | 'onLayout'
> & {
  offset?: number
  cardWidth?: number
  separatorSize?: number
  headerComponent?: ReactElement
  style?: StyleProp<ViewStyle>
  onSeeMoreButtonPress?: (chronicleId: number) => void
}

export const ChronicleCardListBase = forwardRef<
  Partial<FlatList<ChronicleCardData>>,
  ChronicleCardListProps
>(function ChronicleCardListBase(
  {
    data,
    offset,
    horizontal = true,
    cardWidth,
    contentContainerStyle,
    onScroll,
    snapToInterval,
    headerComponent,
    onContentSizeChange,
    style,
    separatorSize = SEPARATOR_DEFAULT_VALUE,
    onSeeMoreButtonPress,
    onLayout,
  },
  ref
) {
  const listRef = useRef<FlatList>(null)

  useImperativeHandle(ref, () => ({
    scrollToOffset: (params) => listRef.current?.scrollToOffset(params),
    scrollToIndex: (params) => listRef.current?.scrollToIndex(params),
  }))

  useEffect(() => {
    if (listRef.current && offset !== undefined) {
      listRef.current.scrollToOffset({ offset, animated: true })
    }
  }, [offset])

  const Separator = useMemo(
    () =>
      styled.View({
        width: horizontal ? getSpacing(separatorSize) : '100%',
        height: horizontal ? '100%' : getSpacing(separatorSize),
      }),
    [separatorSize, horizontal]
  )

  const renderItem = useCallback<ListRenderItem<ChronicleCardData>>(
    ({ item }) => {
      return (
        <ChronicleCard
          id={item.id}
          title={item.title}
          subtitle={item.subtitle}
          description={item.description}
          date={item.date}
          cardWidth={cardWidth}>
          {onSeeMoreButtonPress ? (
            <View>
              <StyledButtonTertiaryBlack
                wording="Voir plus"
                onPress={() => onSeeMoreButtonPress(item.id)}
              />
            </View>
          ) : null}
        </ChronicleCard>
      )
    },
    [cardWidth, onSeeMoreButtonPress]
  )

  return (
    <FlatList
      ref={listRef}
      data={data}
      style={style}
      ListHeaderComponent={headerComponent}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={contentContainerStyle}
      onContentSizeChange={onContentSizeChange}
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={100}
      horizontal={horizontal}
      decelerationRate="fast"
      snapToInterval={snapToInterval}
      testID="chronicle-list"
      onLayout={onLayout}
    />
  )
})

const StyledPlainMore = styled(PlainMore).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const StyledButtonTertiaryBlack = styledButton(ButtonTertiaryBlack).attrs({
  icon: StyledPlainMore,
  iconPosition: 'right',
  buttonHeight: 'extraSmall',
})``
