import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { cookiesInfo } from 'features/cookies/components/cookiesInfo'
import { CookieCategoriesEnum, useCookiesContext } from 'features/cookies/CookiesContext'
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
  const { cookiesChoice, setCookiesChoice } = useCookiesContext()

  const hasAcceptedAll = Object.values(cookiesChoice).every((choice) => choice === true)
  const toggleAll = () => {
    setCookiesChoice({
      customization: !hasAcceptedAll,
      performance: !hasAcceptedAll,
      marketing: !hasAcceptedAll,
    })
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
                active: isEssential ? true : cookiesChoice[cookie],
                disabled: isEssential,
                toggle: () =>
                  isEssential
                    ? null
                    : setCookiesChoice((prev) => ({ ...prev, [cookie]: !cookiesChoice[cookie] })),
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
  <GreyDarkCaption>
    <IconContainer>
      <StyledInfo />
    </IconContainer>
    {children}
  </GreyDarkCaption>
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

const IconContainer = styled.View({
  float: 'left',
  paddingRight: getSpacing(1),
  marginBottom: -getSpacing(0.75),
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
