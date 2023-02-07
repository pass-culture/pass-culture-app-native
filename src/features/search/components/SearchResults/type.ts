import { SearchHit } from 'libs/search'

export interface SearchListProps {
  nbHits: number
  hits: SearchHit[]
  renderItem: ({ item, index }: { item: SearchHit; index: number }) => JSX.Element
  autoScrollEnabled: boolean
  refreshing: boolean
  onRefresh: (() => void) | null | undefined
  isFetchingNextPage: boolean
  onEndReached: () => void
  onScroll?: () => void
  onPress?: () => void
}
