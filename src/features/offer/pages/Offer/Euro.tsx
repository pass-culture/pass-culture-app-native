import { useRoute } from '@react-navigation/core'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { api } from 'api/api'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { OfferTitle } from 'features/offer/components/OfferTitle/OfferTitle'
import { LanguageSelector } from 'features/home/components/headers/LanguageSelector'
import { useTranslation } from 'react-i18next'
import { OfferPrice } from 'features/offer/components/OfferPrice/OfferPrice'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { Typo } from 'ui/theme'
import { CTAButton } from 'features/offer/components/CTAButton/CTAButton'

export const Euro = () => {
  const route = useRoute<UseRouteType<'Euro'>>()
  const euroId = route.params?.id
  const {
    t,
    i18n: { language },
  } = useTranslation()

  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const response = await api.getNativeV1EuropeanOfferofferId(euroId)
      console.log(response)
      setData(response)
    }

    fetchData()
  }, [])

  if (!data) {
    return <React.Fragment></React.Fragment>
  }

  return (
    <ScrollViewContainer testID="offerv2-container" scrollEventThrottle={16} bounces={false}>
      <MarginContainer gap={6}>
        <OfferImageContainer imageUrls={[data.imageUrl]} categoryId={'aaa'} />
        <View>
          <ViewGap gap={4}>
            <LanguageSelector />
            <InformationTags tags={['Europe']} />
            <ViewGap gap={2}>
              <OfferTitle offerName={data.title[language]} />
            </ViewGap>
          </ViewGap>
        </View>

        <OfferPrice prices={[data.price]} />

        <ViewGap gap={4}>
          <Typo.Title3 {...getHeadingAttrs(2)}>{t('about')}</Typo.Title3>
          <ViewGap gap={2}>
            <ViewGap gap={8}>
              <View>
                <Typo.ButtonText>{t('description')}</Typo.ButtonText>
                <CollapsibleText numberOfLines={5}>{data.description[language]}</CollapsibleText>
              </View>
            </ViewGap>
          </ViewGap>
        </ViewGap>
        <CTAButton wording={t('book')} externalNav={{ url: data.externalUrl }} />
        <Gap />
      </MarginContainer>
    </ScrollViewContainer>
  )
}

const ScrollViewContainer = styled(IntersectionObserverScrollView)({
  overflow: 'visible',
})

const MarginContainer = styled(ViewGap)(({ theme }) =>
  theme.isDesktopViewport ? {} : { marginHorizontal: theme.contentPage.marginHorizontal }
)

const Gap = styled.View`
  margin-bottom: 100px;
`
