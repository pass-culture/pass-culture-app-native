import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { ChronicleCardListBase } from 'features/chronicle/components/ChronicleCardListBase/ChronicleCardListBase'
import { ChronicleCardData } from 'features/chronicle/type'
import { PlaylistArrowButton } from 'ui/Playlist/PlaylistArrowButton'

type ChronicleCardListProps = {
  data: ChronicleCardData[]
  horizontal?: boolean
  cardWidth?: number
}

export const ChronicleCardList: FunctionComponent<ChronicleCardListProps> = ({
  data,
  horizontal = true,
  cardWidth,
}) => {
  const [indexItem, setIndexItem] = useState(0)

  const goToPreviousPage = () => setIndexItem((prev) => Math.max(prev - 1, 0))
  const goToNextPage = () => setIndexItem((prev) => Math.min(prev + 1, data.length - 1))

  return (
    <FlatListContainer>
      {horizontal ? (
        <React.Fragment>
          {indexItem > 0 ? (
            <PlaylistArrowButton
              direction="left"
              onPress={goToPreviousPage}
              testID="chronicle-list-left-arrow"
            />
          ) : null}

          {indexItem < data.length - 1 ? (
            <PlaylistArrowButton
              direction="right"
              onPress={goToNextPage}
              testID="chronicle-list-right-arrow"
            />
          ) : null}
        </React.Fragment>
      ) : null}
      <ChronicleCardListBase
        data={data}
        indexItem={indexItem}
        horizontal={horizontal}
        cardWidth={cardWidth}
      />
    </FlatListContainer>
  )
}

const FlatListContainer = styled.View<{ minHeight?: number }>({
  position: 'relative',
  width: '100%',
})
