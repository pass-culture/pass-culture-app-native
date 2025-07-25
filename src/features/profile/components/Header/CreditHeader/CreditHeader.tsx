import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { DomainsCredit, EligibilityType } from 'api/gen/api'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings/BeneficiaryCeilings'
import { CreditExplanation } from 'features/profile/components/CreditExplanation/CreditExplanation'
import { CreditInfo } from 'features/profile/components/CreditInfo/CreditInfo'
import { EmptyCredit } from 'features/profile/components/EmptyCredit/EmptyCredit'
import { getCreditExpirationText } from 'features/profile/components/Header/CreditHeader/getCreditExpirationText'
import { HeaderWithGreyContainer } from 'features/profile/components/Header/HeaderWithGreyContainer/HeaderWithGreyContainer'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { getHeaderSubtitleProps } from 'features/profile/helpers/getHeaderSubtitleProps'
import { useIsUserUnderageBeneficiary } from 'features/profile/helpers/useIsUserUnderageBeneficiary'
import { setDateOneDayEarlier } from 'libs/dates'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Offers } from 'ui/svg/icons/Offers'
import { getSpacing, Typo } from 'ui/theme'

export type CreditHeaderProps = {
  firstName?: string | null
  lastName?: string | null
  age?: number
  domainsCredit?: DomainsCredit | null
  depositExpirationDate?: string
  eligibility?: EligibilityType | null
}

export function CreditHeader({
  firstName,
  lastName,
  age,
  domainsCredit,
  depositExpirationDate,
  eligibility,
}: CreditHeaderProps) {
  const { designSystem } = useTheme()
  const {
    data: { homeEntryIdFreeOffers },
  } = useRemoteConfigQuery()
  const depositAmount = useDepositAmountsByAge()

  const sixteenYearsOldIncomingDeposit = {
    label: 'À venir pour tes 17 ans\u00a0: ',
    highlightedLabel: `+ ${depositAmount.seventeenYearsOldDeposit}`,
  }

  const incomingCreditLabelsMap: Record<number, { label: string; highlightedLabel: string }> = {
    15: sixteenYearsOldIncomingDeposit,
    16: sixteenYearsOldIncomingDeposit,
    17: {
      label: 'À venir pour tes 18 ans\u00a0: ',
      highlightedLabel: `${depositAmount.eighteenYearsOldDeposit}`,
    },
  }
  const name = firstName && lastName ? `${firstName} ${lastName}` : ''
  const IsUserUnderageBeneficiary = useIsUserUnderageBeneficiary()

  if (!domainsCredit || !age) return null

  const isCreditEmpty = domainsCredit.all.remaining === 0
  const isDepositExpired = depositExpirationDate
    ? new Date(depositExpirationDate) < new Date()
    : false

  const subtitleProps = getHeaderSubtitleProps({
    isCreditEmpty,
    isDepositExpired,
    depositExpirationDate,
    eligibility,
  })

  const isExpiredOrCreditEmptyWithNoUpcomingCredit =
    age >= 18 && (isDepositExpired || isCreditEmpty)

  const bannerText =
    depositExpirationDate && !isCreditEmpty
      ? getCreditExpirationText({
          depositExpirationDate: new Date(setDateOneDayEarlier(depositExpirationDate)),
          userStatus: IsUserUnderageBeneficiary ? 'underageBeneficiary' : 'beneficiary',
        })
      : undefined

  return (
    <HeaderWithGreyContainer
      title={name}
      bannerText={bannerText}
      subtitle={<Subtitle {...subtitleProps} />}
      withGreyContainer={!isExpiredOrCreditEmptyWithNoUpcomingCredit}>
      {isExpiredOrCreditEmptyWithNoUpcomingCredit ? (
        <InternalTouchableLink
          navigateTo={{
            screen: 'ThematicHome',
            params: { homeId: homeEntryIdFreeOffers, from: 'profile' },
          }}>
          <GenericBanner LeftIcon={<Offers color={designSystem.color.icon.brandPrimary} />}>
            <ViewGap gap={1}>
              <Typo.BodyAccent>L’aventure continue&nbsp;!</Typo.BodyAccent>
              <StyledBody numberOfLines={3}>
                Tu peux profiter d’offres gratuites autour de toi.
              </StyledBody>
            </ViewGap>
          </GenericBanner>
        </InternalTouchableLink>
      ) : (
        <React.Fragment>
          {isDepositExpired || isCreditEmpty ? null : (
            <React.Fragment>
              <CreditInfo totalCredit={domainsCredit.all} />
              <BeneficiaryCeilings domainsCredit={domainsCredit} />
            </React.Fragment>
          )}
          {incomingCreditLabelsMap[age] && !isCreditEmpty ? (
            <ViewWithMarginTop top={6}>
              <Typo.Body>
                {
                  /* @ts-expect-error: because of noUncheckedIndexedAccess */
                  incomingCreditLabelsMap[age].label
                }
                {/* @ts-expect-error: because of noUncheckedIndexedAccess */}
                <HighlightedBody>{incomingCreditLabelsMap[age].highlightedLabel}</HighlightedBody>
              </Typo.Body>
            </ViewWithMarginTop>
          ) : null}
          {isCreditEmpty ? <EmptyCredit age={age} eligibility={eligibility} /> : null}
          <ViewWithMarginTop top={1}>
            <CreditExplanation isDepositExpired={isDepositExpired} age={age} />
          </ViewWithMarginTop>
        </React.Fragment>
      )}
    </HeaderWithGreyContainer>
  )
}

const HighlightedBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const ViewWithMarginTop = styled.View<{ top: number }>(({ top }) => ({
  marginTop: getSpacing(top),
}))
