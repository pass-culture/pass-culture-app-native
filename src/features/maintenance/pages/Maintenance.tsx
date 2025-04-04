import React from 'react'

import { GenericErrorPage } from 'ui/pages/GenericErrorPage'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'

type MaintenanceProps = {
  message?: string
}

// NEVER EVER USE NAVIGATION (OR ANYTHING FROM @react-navigation)
// ON THIS PAGE OR IT WILL BREAK!!!
// THE NAVIGATION CONTEXT IS NOT ALWAYS LOADED WHEN WE DISPLAY
// EX: ScreenErrorProvider IS OUTSIDE NAVIGATION !
export const Maintenance: React.FC<MaintenanceProps> = (props) => {
  const helmetTitle = 'Maintenance | pass Culture'
  const subtitle =
    props.message ??
    'L’application est actuellement en maintenance, mais sera à nouveau en ligne rapidement\u00a0!'

  return (
    <GenericErrorPage
      helmetTitle={helmetTitle}
      illustration={MaintenanceCone}
      title="Maintenance en cours"
      subtitle={subtitle}
    />
  )
}
