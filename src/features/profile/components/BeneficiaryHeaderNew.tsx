import { t } from '@lingui/macro'
import React, { Fragment } from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { CreditInfo } from 'features/profile/components/CreditInfo'
import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

type BeneficiaryHeaderProps = {
  firstName?: string | null
  lastName?: string | null
  domainsCredit?: DomainsCredit | null
  depositExpirationDate?: string
}

export function BeneficiaryHeaderNew({
  firstName,
  lastName,
  domainsCredit,
  depositExpirationDate,
}: BeneficiaryHeaderProps) {
  const name = `${firstName} ${lastName}`
  return (
    <Fragment>
      <PageHeader title={name} size="medium" />
      <Container>
        <Row>
          <Typo.Body>{t`Profite de ton crédit jusqu’au` + SPACE}</Typo.Body>
          <Typo.ButtonText>{depositExpirationDate}</Typo.ButtonText>
        </Row>
        {!!domainsCredit && (
          <Fragment>
            <Spacer.Column numberOfSpaces={2} />
            <CreditInfo totalCredit={domainsCredit.all} />
            {/* Extract domain credit physical and digital informations into a new component with domainsCredit props */}
            {!!domainsCredit.digital && (
              <React.Fragment>
                <Spacer.Column numberOfSpaces={6} />
                <Row>
                  <Typo.Body>{t`dont` + SPACE}</Typo.Body>
                  <BodySecondary>
                    {formatToFrenchDecimal(domainsCredit.digital.remaining) + SPACE}
                  </BodySecondary>
                  <Typo.Body>{t`pour les offres numériques`}</Typo.Body>
                </Row>
              </React.Fragment>
            )}
            {!!domainsCredit.physical && (
              <Row>
                <Typo.Body>{t`dont` + SPACE}</Typo.Body>
                <BodySecondary>
                  {formatToFrenchDecimal(domainsCredit.physical.remaining) + SPACE}
                </BodySecondary>
                <Typo.Body>{t`pour les sorties`}</Typo.Body>
              </Row>
            )}
          </Fragment>
        )}
      </Container>
    </Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  margin: getSpacing(6),
  padding: getSpacing(6),
  borderRadius: getSpacing(2),
  backgroundColor: theme.colors.greyLight,
}))

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})

const BodySecondary = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))
