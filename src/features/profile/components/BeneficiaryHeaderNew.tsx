import { t } from '@lingui/macro'
import React, { Fragment } from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
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
            {/* Use new ProgressBar instead */}
            <Typo.Hero>{convertCentsToEuros(domainsCredit?.all.remaining)}</Typo.Hero>
            {/* Extract domain credit physical and digital informations into a new component with domainsCredit props */}
            {!!domainsCredit.digital && (
              <React.Fragment>
                <Spacer.Column numberOfSpaces={2} />
                <Row>
                  <Typo.Body>{t`dont` + SPACE}</Typo.Body>
                  <BodySecondary>
                    {convertCentsToEuros(domainsCredit.digital.remaining)}
                  </BodySecondary>
                  <Typo.Body>{t`€ pour les offres numériques`}</Typo.Body>
                </Row>
              </React.Fragment>
            )}
            {!!domainsCredit.physical && (
              <Row>
                <Typo.Body>{t`dont` + SPACE}</Typo.Body>
                <BodySecondary>
                  {convertCentsToEuros(domainsCredit.physical.remaining)}
                </BodySecondary>
                <Typo.Body>{t`€ pour les sorties`}</Typo.Body>
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
