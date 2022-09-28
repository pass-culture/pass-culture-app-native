import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { cookiesInfo } from 'features/cookies/components/cookiesInfo'
import { CookieCategoriesEnum } from 'features/cookies/enums'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { useCookiesChoiceByCategory } from 'features/cookies/helpers/useCookiesChoiceByCategory'
import { CookiesChoiceSettings } from 'features/cookies/types'
import { analytics } from 'libs/firebase/analytics'
import { AccordionItem } from 'ui/components/AccordionItem'
import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { Separator } from 'ui/components/Separator'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const CookiesSettings = ({
  settingsCookiesChoice,
  setSettingsCookiesChoice,
}: CookiesChoiceSettings) => {
  const checkboxID = uuidv4()
  const { cookiesConsent } = useCookies()
  const cookiesChoiceByCategory = useCookiesChoiceByCategory(cookiesConsent)

  useFocusEffect(
    useCallback(() => {
      setSettingsCookiesChoice({
        customization: cookiesChoiceByCategory.customization,
        performance: cookiesChoiceByCategory.performance,
        marketing: cookiesChoiceByCategory.marketing,
      })
    }, [
      setSettingsCookiesChoice,
      cookiesChoiceByCategory.customization,
      cookiesChoiceByCategory.marketing,
      cookiesChoiceByCategory.performance,
    ])
  )

  const hasAcceptedAll = Object.values(settingsCookiesChoice).every((choice) => choice === true)

  const toggleAll = () => {
    setSettingsCookiesChoice({
      customization: !hasAcceptedAll,
      performance: !hasAcceptedAll,
      marketing: !hasAcceptedAll,
    })
  }

  const inputLabel = 'Tout accepter'

  return (
    <React.Fragment>
      <Typo.Title4 {...getHeadingAttrs(2)}>
        À quoi servent tes cookies et tes données&nbsp;?
      </Typo.Title4>
      <Spacer.Column numberOfSpaces={6} />
      <ChoiceContainer>
        <Typo.CaptionNeutralInfo>Je choisis mes cookies</Typo.CaptionNeutralInfo>
        <AcceptAllContainer>
          <StyledInputLabel htmlFor={checkboxID}>{inputLabel}</StyledInputLabel>
          <Spacer.Row numberOfSpaces={2} />
          <FilterSwitch active={hasAcceptedAll} checkboxID={checkboxID} toggle={toggleAll} />
        </AcceptAllContainer>
      </ChoiceContainer>
      <Spacer.Row numberOfSpaces={4} />
      {Object.entries(cookiesInfo).map((entry) => {
        const cookie = entry[0] as CookieCategoriesEnum
        const info = entry[1]
        const isEssential = cookie === CookieCategoriesEnum.essential
        return (
          <React.Fragment key={cookie}>
            <StyledAccordionItem
              title={<Typo.Body>{info.title}</Typo.Body>}
              onOpenOnce={() => analytics.logHasOpenedCookiesAccordion(cookie)}
              switchProps={{
                testID: cookie,
                active: isEssential ? true : settingsCookiesChoice[cookie],
                disabled: isEssential,
                toggle: () =>
                  isEssential
                    ? null
                    : setSettingsCookiesChoice((prev) => ({
                        ...prev,
                        [cookie]: !settingsCookiesChoice[cookie],
                      })),
              }}>
              <React.Fragment>
                <Typo.Body>{info.description}</Typo.Body>
                {!!info.caption && (
                  <React.Fragment>
                    <Spacer.Column numberOfSpaces={4} />
                    <InfoCaption>{info.caption}</InfoCaption>
                  </React.Fragment>
                )}
              </React.Fragment>
            </StyledAccordionItem>
            {!!info.permanentCaption && (
              <React.Fragment>
                <InfoCaption>{info.permanentCaption}</InfoCaption>
                <Spacer.Column numberOfSpaces={4} />
              </React.Fragment>
            )}
            <Separator />
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

const InfoCaption: React.FC = ({ children }) => (
  <View>
    <IconContainer>
      <StyledInfo />
    </IconContainer>
    <Typo.CaptionNeutralInfo>
      <IconSpacer />
      {children}
    </Typo.CaptionNeutralInfo>
  </View>
)

const ChoiceContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const AcceptAllContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const SPACER_BETWEEN_ICON_AND_TEXT = getSpacing(1)
const IconSpacer = styled.View(({ theme }) => ({
  width: theme.icons.sizes.extraSmall + SPACER_BETWEEN_ICON_AND_TEXT,
}))

const IconContainer = styled.View({
  position: 'absolute',
})

const StyledInputLabel = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.greyDark,
}))

const StyledInfo = styled(InfoPlain).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.primary,
}))``

const StyledAccordionItem = styled(AccordionItem).attrs({
  titleStyle: {
    paddingVertical: getSpacing(4),
    paddingHorizontal: 0,
  },
  bodyStyle: {
    paddingBottom: getSpacing(4),
    paddingHorizontal: 0,
  },
})``
