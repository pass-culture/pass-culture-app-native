import { t } from '@lingui/macro'
import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings'
import { computeCredit, useIsUserUnderageBeneficiary } from 'features/profile/utils'
import { formatToFrenchDecimal } from 'libs/parsers'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Typo, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'

type BeneficiaryHeaderProps = {
  firstName?: string | null
  lastName?: string | null
  domainsCredit?: DomainsCredit | null
  depositExpirationDate?: string
}

export function BeneficiaryHeader(props: PropsWithChildren<BeneficiaryHeaderProps>) {
  const { firstName, lastName, domainsCredit, depositExpirationDate } = props
  const name = `${firstName} ${lastName}`
  const credit = formatToFrenchDecimal(computeCredit(domainsCredit))
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()

  return (
    <Container testID="beneficiary-header">
      <Spacer.TopScreen />
      <HeaderBackgroundWrapper>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <Spacer.Column numberOfSpaces={6} />
      <UserNameAndCredit>
        <Title>{name}</Title>
        <Spacer.Column numberOfSpaces={4.5} />
        {!isUserUnderageBeneficiary && <Hero>{credit}</Hero>}
        <Spacer.Column numberOfSpaces={2} />
        {!!depositExpirationDate && (
          <Caption>{t`crédit valable jusqu'au` + `\u00a0${depositExpirationDate}`}</Caption>
        )}
        <Spacer.Column numberOfSpaces={6} />
      </UserNameAndCredit>
      <Ceilings
        domainsCredit={domainsCredit}
        isUserUnderageBeneficiary={isUserUnderageBeneficiary}
      />
    </Container>
  )
}

const Container = styled.View({
  paddingHorizontal: getSpacing(5.5),
})

const HeaderBackgroundWrapper = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  maxHeight: getSpacing(73.5),
})

const UserNameAndCredit = styled.View({
  alignItems: 'center',
})

const Ceilings = styled(BeneficiaryCeilings)({
  top: getSpacing(42),
})

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(1))(({ theme }) => ({
  color: theme.colors.white,
}))

const Hero = styled(Typo.Hero)(({ theme }) => ({
  color: theme.colors.white,
}))

const Caption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))
