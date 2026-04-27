import React, { forwardRef } from 'react'
import { FlatList } from 'react-native-gesture-handler'

import { HorizontalAdviceCardList } from 'features/advices/components/AdviceCardList/HorizontalAdviceCardList.web'
import { VerticalAdviceCardList } from 'features/advices/components/AdviceCardList/VerticalAdviceCardList.web'
import { AdviceCardData, AdviceCardListProps } from 'features/advices/types'

export const AdviceCardList = forwardRef<Partial<FlatList<AdviceCardData>>, AdviceCardListProps>(
  function AdviceCardList({ horizontal = true, ...props }, ref) {
    if (horizontal === false) {
      return <VerticalAdviceCardList {...props} horizontal={false} ref={ref} />
    }

    return <HorizontalAdviceCardList {...props} horizontal ref={ref} />
  }
)
