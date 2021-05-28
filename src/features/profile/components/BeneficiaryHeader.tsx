import { t } from '@lingui/macro'
import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings'
import { computeCredit } from 'features/profile/utils'
import { formatToFrenchDecimal } from 'libs/parsers'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, ColorsEnum, Typo, Spacer, ScreenWidth } from 'ui/theme'

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

  return (
    <Container testID="beneficiary-header">
      <HeaderBackgroundWrapper>
        <HeaderBackground width={ScreenWidth} />
      </HeaderBackgroundWrapper>
      <Spacer.Column numberOfSpaces={12} />
      <UserNameAndCredit>
        <Typo.Title4 color={ColorsEnum.WHITE}>{name}</Typo.Title4>
        <Spacer.Column numberOfSpaces={4.5} />
        <Typo.Hero color={ColorsEnum.WHITE}>{credit}</Typo.Hero>
        <Spacer.Column numberOfSpaces={2} />
        {!!depositExpirationDate && (
          <Typo.Caption color={ColorsEnum.WHITE}>
            {t`crédit valable jusqu'au` + `\u00a0${depositExpirationDate}`}
          </Typo.Caption>
        )}
        <Spacer.Column numberOfSpaces={6} />
      </UserNameAndCredit>
      <Ceilings domainsCredit={domainsCredit} />
    </Container>
  )
}

const Container = styled.View({
  paddingHorizontal: getSpacing(5.5),
})

const HeaderBackgroundWrapper = styled.View({
  position: 'absolute',
  top: 0,
  maxHeight: getSpacing(73.5),
})

const UserNameAndCredit = styled.View({
  alignItems: 'center',
})

const Ceilings = styled(BeneficiaryCeilings)({
  top: getSpacing(42),
})
