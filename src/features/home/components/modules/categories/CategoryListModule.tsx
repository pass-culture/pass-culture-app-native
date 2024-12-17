import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { CategoryBlock } from 'features/home/components/modules/categories/CategoryBlock'
import { CategoryBlock as CategoryBlockData } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { getSpacing, TypoDS } from 'ui/theme'

type CategoryListProps = {
  id: string
  title: string
  categoryBlockList: CategoryBlockData[]
  index: number
  homeEntryId: string
}

const DESKTOP_GAPS_AND_PADDINGS = getSpacing(4)
const MOBILE_GAPS_AND_PADDINGS = getSpacing(2)

const keyExtractor = (_item: CategoryBlockData, index: number) => `category_block_#${index}`

export const CategoryListModule = ({
  id,
  title,
  categoryBlockList,
  index,
  homeEntryId,
}: CategoryListProps) => {
  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage({
      moduleId: id,
      moduleType: ContentTypes.CATEGORY_LIST,
      index,
      homeEntryId,
    })
  }, [id, homeEntryId, index])

  return (
    <Container>
      <StyledTitle numberOfLines={2}>{title}</StyledTitle>
      <StyledView>
        {categoryBlockList.map((item, index) => (
          <CategoryBlock
            {...item}
            key={keyExtractor(item, index)}
            onBeforePress={() => {
              analytics.logCategoryBlockClicked({
                moduleId: item.id,
                moduleListID: id,
                entryId: homeEntryId,
                toEntryId: item.homeEntryId,
              })
            }}
            navigateTo={{
              screen: 'ThematicHome',
              params: {
                homeId: item.homeEntryId,
                from: 'category_block',
                moduleId: item.id,
                moduleListId: id,
              },
            }}
          />
        ))}
      </StyledView>
    </Container>
  )
}

const StyledView = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  ...(theme.isMobileViewport
    ? {
        flexWrap: 'wrap',
        gap: MOBILE_GAPS_AND_PADDINGS,
        paddingVertical: MOBILE_GAPS_AND_PADDINGS,
      }
    : {
        gap: DESKTOP_GAPS_AND_PADDINGS,
        paddingVertical: DESKTOP_GAPS_AND_PADDINGS,
      }),
}))

const StyledTitle = styled(TypoDS.Title3)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const Container = styled.View({
  marginBottom: getSpacing(6),
})
