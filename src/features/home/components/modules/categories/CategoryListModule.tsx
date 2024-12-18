import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { CategoryBlock as CategoryBlockData } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { CategoryButton } from 'shared/Buttons/CategoryButton'
import { getSpacing, TypoDS } from 'ui/theme'
import { newColorMapping } from 'ui/theme/newColorMapping'

type CategoryListProps = {
  id: string
  title: string
  categoryBlockList: CategoryBlockData[]
  index: number
  homeEntryId: string
}

const BLOCK_HEIGHT = getSpacing(24)
const DESKTOP_MAX_WIDTH = getSpacing(37.33)
const DESKTOP_GAPS_AND_PADDINGS = getSpacing(4)
const MOBILE_GAPS_AND_PADDINGS = getSpacing(2)

export const CategoryListModule = ({
  id,
  title,
  categoryBlockList,
  index,
  homeEntryId,
}: CategoryListProps) => {
  const { navigate } = useNavigation<UseNavigationType>()

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
        {categoryBlockList.map((item) => (
          <StyledCategoryButton
            key={item.id}
            label={item.title}
            height={BLOCK_HEIGHT}
            textColor={newColorMapping[item.color].text}
            fillColor={newColorMapping[item.color].fill}
            borderColor={newColorMapping[item.color].border}
            onPress={() => {
              analytics.logCategoryBlockClicked({
                moduleId: item.id,
                moduleListID: id,
                entryId: homeEntryId,
                toEntryId: item.homeEntryId,
              })
              navigate('ThematicHome', {
                homeId: item.homeEntryId,
                from: 'category_block',
                moduleId: item.id,
                moduleListId: id,
              })
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

const StyledCategoryButton = styled(CategoryButton)(({ theme }) => ({
  flex: '1 0 0',
  minWidth: theme.isMobileViewport ? '35%' : 'none',
  maxWidth: theme.isMobileViewport ? '50%' : DESKTOP_MAX_WIDTH,
}))
