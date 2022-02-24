import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Helmet } from 'libs/react-helmet/Helmet'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { LogoPassCulture as LogoPassCultureOriginal } from 'ui/svg/icons/LogoPassCulture'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { Spacer, Typo } from 'ui/theme'

type MaintenanceProps = {
  message?: string
}

export const Maintenance: React.FC<MaintenanceProps> = (props) => {
  return (
    <React.Fragment>
      <Helmet>
        <title>{t`Maintenance` + ' | pass Culture'}</title>
      </Helmet>
      <GenericInfoPage title={t`Maintenance en cours`} icon={MaintenanceCone}>
        <Spacer.Column numberOfSpaces={6} />
        <StyledBody>
          {props.message
            ? props.message
            : t`L’application est actuellement en maintenance, mais sera à nouveau en ligne rapidement\u00a0!`}
        </StyledBody>
        <Spacer.Column numberOfSpaces={24} />
        <LogoPassCulture />
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

const LogoPassCulture = styled(LogoPassCultureOriginal)({
  alignItems: 'flex-end',
  flex: 1,
})
