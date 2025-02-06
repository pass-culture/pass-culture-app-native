import React, { Dispatch, SetStateAction } from 'react'

import { env } from 'libs/environment/env'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer } from 'ui/theme'

type Props = {
  isChecked: boolean
  setIsChecked: Dispatch<SetStateAction<boolean>>
}

export const CguWithCheckbox: React.FC<Props> = ({ isChecked, setIsChecked }) => {
  return (
    <React.Fragment>
      <Checkbox
        label="J’ai lu et j’accepte les conditions générales d’utilisation"
        isChecked={isChecked}
        onPress={() => setIsChecked(!isChecked)}
      />
      <Spacer.Column numberOfSpaces={4} />
      <ExternalTouchableLink
        as={ButtonQuaternaryBlack}
        wording="Nos conditions générales d’utilisation"
        externalNav={{ url: env.CGU_LINK }}
        justifyContent="flex-start"
        inline
        icon={ExternalSiteFilled}
      />
    </React.Fragment>
  )
}
