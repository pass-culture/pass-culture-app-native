import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { CategoryBlock as CategoryBlockData } from 'features/home/types'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useFontScaleValue } from 'shared/accessibility/useFontScaleValue'
import { CategoryButton } from 'shared/categoryButton/CategoryButton'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Bulb } from 'ui/svg/icons/Bulb'
import { getSpacing } from 'ui/theme'
import { colorMapping } from 'ui/theme/colorMapping'

type CategoryListProps = {
  id: string
  title: string
  categoryBlockList: CategoryBlockData[]
  index: number
  homeEntryId: string
}

const BLOCK_HEIGHT = getSpacing(25)
const DESKTOP_MAX_WIDTH = getSpacing(37.33)
const DESKTOP_MIN_WIDTH = 'none'
const MOBILE_MIN_WIDTH = '40%'
const MOBILE_MIN_WIDTH_WHEN_FONT_ZOOMED = '100%'
const MOBILE_MAX_WIDTH = '49%'
const DESKTOP_GAPS_AND_PADDINGS = getSpacing(4)
const MOBILE_GAPS_AND_PADDINGS = getSpacing(2)

export const CategoryListModule = ({
  id,
  title,
  categoryBlockList,
  index,
  homeEntryId,
}: CategoryListProps) => {
  const mobileMinWidth = useFontScaleValue({
    default: MOBILE_MIN_WIDTH,
    at200PercentZoom: MOBILE_MIN_WIDTH_WHEN_FONT_ZOOMED,
  })

  const { designSystem } = useTheme()
  const enableHomeSatisfactionQualtrics = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_HOME_SATISFACTION_QUALTRICS
  )
  const [homeSatisfactionQualtricsPressed, setHomeSatisfactionQualtricsPressed] = useState<
    string | null
  >(null)

  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage({
      moduleId: id,
      moduleType: ContentTypes.CATEGORY_LIST,
      index,
      homeEntryId,
    })
  }, [id, homeEntryId, index])

  useEffect(() => {
    const fetchQualtricsPressed = async () => {
      const saved = await AsyncStorage.getItem('home_satisfaction_qualtrics_pressed')

      if (saved) {
        setHomeSatisfactionQualtricsPressed('pressed')
      } else {
        setHomeSatisfactionQualtricsPressed(null)
      }
    }
    fetchQualtricsPressed()
  }, [])

  const handleQualtricsButtonPress = async () => {
    setHomeSatisfactionQualtricsPressed('pressed')
    await AsyncStorage.setItem('home_satisfaction_qualtrics_pressed', 'pressed')
  }

  return (
    <Container>
      <AccessibleTitle title={title} />
      <StyledView>
        {categoryBlockList.map((item) => {
          const fillFromDesignSystem =
            designSystem.color.background[colorMapping[item.color].fill ?? 'default']

          const borderFromDesignSystem =
            designSystem.color.border[colorMapping[item.color].border ?? 'default']
          return (
            <StyledCategoryButton
              key={item.id}
              label={item.title}
              height={BLOCK_HEIGHT}
              mobileMinWidth={mobileMinWidth}
              fillColor={fillFromDesignSystem || colorMapping[item.color].fill}
              borderColor={borderFromDesignSystem || colorMapping[item.color].border}
              onBeforeNavigate={() => {
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
          )
        })}
      </StyledView>
      {enableHomeSatisfactionQualtrics && !homeSatisfactionQualtricsPressed ? (
        <BannerContainer>
          <Banner
            label="Un avis sur cette page&nbsp;? Partage-nous tes idées pour nous aider à l’améliorer&nbsp;!"
            Icon={Bulb}
            links={[
              {
                wording: 'Répondre au court questionnaire',
                externalNav: {
                  url: 'https://passculture.qualtrics.com/jfe/form/SV_dgtDyqEDDDlH8xg',
                },
                onBeforeNavigate: handleQualtricsButtonPress,
              },
            ]}
          />
        </BannerContainer>
      ) : null}
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

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const StyledCategoryButton = styled(CategoryButton)<{ mobileMinWidth: string }>(
  ({ theme, mobileMinWidth }) => ({
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    minWidth: theme.isMobileViewport ? mobileMinWidth : DESKTOP_MIN_WIDTH,
    maxWidth: theme.isMobileViewport ? MOBILE_MAX_WIDTH : DESKTOP_MAX_WIDTH,
  })
)

const BannerContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginTop: theme.designSystem.size.spacing.xxxl,
}))
