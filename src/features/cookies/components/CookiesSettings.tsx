import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CookiesAccordion } from 'features/cookies/components/CookiesAccordion'
import { cookiesInfo } from 'features/cookies/components/cookiesInfo'
import { CookieCategoriesEnum } from 'features/cookies/enums'
import { getCookiesChoiceByCategory } from 'features/cookies/helpers/getCookiesChoiceByCategory'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { CookiesChoiceSettings } from 'features/cookies/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { InteractionManager } from 'react-native'
import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Anchor } from 'ui/components/anchor/Anchor'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const checkboxID = uuidv4()
const labelID = uuidv4()

export const CookiesSettings = ({
  settingsCookiesChoice,
  setSettingsCookiesChoice,
  offerId,
}: CookiesChoiceSettings) => {
  const { cookiesConsent } = useCookies()
  const shouldDisplayVideoCookiesToggle = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_VIDEO_COOKIES_CONSENT
  )
  const cookiesChoiceByCategory = getCookiesChoiceByCategory(cookiesConsent)
  useFocusEffect(
    useCallback(() => {
      setSettingsCookiesChoice({
        customization: cookiesChoiceByCategory.customization,
        performance: cookiesChoiceByCategory.performance,
        marketing: cookiesChoiceByCategory.marketing,
        video: cookiesChoiceByCategory.video,
      })
    }, [
      setSettingsCookiesChoice,
      cookiesChoiceByCategory.customization,
      cookiesChoiceByCategory.marketing,
      cookiesChoiceByCategory.performance,
      cookiesChoiceByCategory.video,
    ])
  )
  const scrollToAnchor = useScrollToAnchor()

  const hasAcceptedAll = Object.values(settingsCookiesChoice).every((choice) => choice === true)

  const toggleAll = () => {
    setSettingsCookiesChoice({
      customization: !hasAcceptedAll,
      performance: !hasAcceptedAll,
      marketing: !hasAcceptedAll,
      video: !hasAcceptedAll,
    })
  }

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (!!offerId) {
        scrollToAnchor('cookies-accordion')
      }
    })
  }, [])

  const inputLabel = 'Tout accepter'
  const { [CookieCategoriesEnum.video]: _videoCookiesInfo, ...otherCookiesInfo } = cookiesInfo
  const visibleCookiesInfo = shouldDisplayVideoCookiesToggle ? cookiesInfo : otherCookiesInfo

  return (
    <React.Fragment>
      <Typo.Title4 {...getHeadingAttrs(2)}>
        À quoi servent tes cookies et tes données&nbsp;?
      </Typo.Title4>
      <ChoiceContainer>
        <CaptionNeutralInfo>Je choisis mes cookies</CaptionNeutralInfo>
        <AcceptAllContainer gap={2}>
          <StyledInputLabel id={labelID} htmlFor={checkboxID}>
            {inputLabel}
          </StyledInputLabel>
          <FilterSwitch
            active={hasAcceptedAll}
            accessibilityLabelledBy={labelID}
            checkboxID={checkboxID}
            toggle={toggleAll}
            accessibilityLabel={inputLabel}
            testID={inputLabel}
          />
        </AcceptAllContainer>
      </ChoiceContainer>
      {Object.keys(visibleCookiesInfo).map((cookie) =>
        (cookie as CookieCategoriesEnum) === CookieCategoriesEnum.video ? (
          <Anchor name="cookies-accordion" key={cookie}>
            <CookiesAccordion
              cookie={cookie as CookieCategoriesEnum}
              settingsCookiesChoice={settingsCookiesChoice}
              setSettingsCookiesChoice={setSettingsCookiesChoice}
              offerId={offerId}
            />
          </Anchor>
        ) : (
          <CookiesAccordion
            key={cookie}
            cookie={cookie as CookieCategoriesEnum}
            settingsCookiesChoice={settingsCookiesChoice}
            setSettingsCookiesChoice={setSettingsCookiesChoice}
            offerId={offerId}
          />
        )
      )}
    </React.Fragment>
  )
}

const ChoiceContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: getSpacing(6),
})

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  flexShrink: 1,
}))

const AcceptAllContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledInputLabel = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.designSystem.typography.bodyAccentXs,
  color: theme.designSystem.color.text.subtle,
}))
