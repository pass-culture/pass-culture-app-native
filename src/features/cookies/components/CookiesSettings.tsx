import { t } from '@lingui/macro'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { cookiesInfo } from 'features/cookies/components/cookiesInfo'
import {
  allOptionalCookies,
  CookieCategoriesEnum,
  COOKIES_BY_CATEGORY,
} from 'features/cookies/cookiesPolicy'
import { useCookies } from 'features/cookies/useCookies'
import { AccordionItem } from 'ui/components/AccordionItem'
import FilterSwitch from 'ui/components/FilterSwitch'
import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { Separator } from 'ui/components/Separator'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const CookiesSettings = () => {
  const checkboxID = uuidv4()
  const { cookiesChoice, setCookiesChoice } = useCookies()
  const hasAcceptedAll = cookiesChoice.accepted === allOptionalCookies

  // console.log({ hasAcceptedAll })
  // console.log('cookiesChoice.accepted', cookiesChoice.accepted)
  // console.log('allOptionalCookies', allOptionalCookies)

  const toggleAll = () => {
    if (hasAcceptedAll) {
      setCookiesChoice({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: allOptionalCookies,
      })
    } else {
      setCookiesChoice({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: allOptionalCookies,
        refused: [],
      })
    }
  }

  return (
    <React.Fragment>
      <Typo.Title4
        {...getHeadingAttrs(2)}>{t`À quoi servent tes cookies et tes données\u00a0?`}</Typo.Title4>
      <Spacer.Column numberOfSpaces={6} />
      <ChoiceContainer>
        <GreyDarkCaption>{t`Je choisis mes cookies`}</GreyDarkCaption>
        <AcceptAllContainer>
          <StyledInputLabel htmlFor={checkboxID}>{t`Tout accepter`}</StyledInputLabel>
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
              switchProps={{
                active: isEssential ? true : hasAcceptedAll,
                disabled: isEssential,
                // TODO(LucasBeneston): active this toggle
                toggle: () => (isEssential ? null : false),
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
    <GreyDarkCaption>
      <IconSpacer />
      {children}
    </GreyDarkCaption>
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
