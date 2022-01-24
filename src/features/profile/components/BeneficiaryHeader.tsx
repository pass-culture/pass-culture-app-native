import { t } from '@lingui/macro'
import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings'
import { computeCredit, useIsUserUnderageBeneficiary } from 'features/profile/utils'
import { formatToFrenchDecimal } from 'libs/parsers'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Typo, Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

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
        <Typo.Title4 color={ColorsEnum.WHITE}>{name}</Typo.Title4>
        <Spacer.Column numberOfSpaces={4.5} />
        {!isUserUnderageBeneficiary && <Typo.Hero color={ColorsEnum.WHITE}>{credit}</Typo.Hero>}
        <Spacer.Column numberOfSpaces={2} />
        {!!depositExpirationDate && (
          <Typo.Caption color={ColorsEnum.WHITE}>
            {t`crédit valable jusqu'au` + `\u00a0${depositExpirationDate}`}
          </Typo.Caption>
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
