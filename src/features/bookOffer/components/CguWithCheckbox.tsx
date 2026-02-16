import React, { Dispatch, SetStateAction } from 'react'

import { env } from 'libs/environment/env'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

type Props = {
  isChecked: boolean
  setIsChecked: Dispatch<SetStateAction<boolean>>
}

export const CguWithCheckbox: React.FC<Props> = ({ isChecked, setIsChecked }) => {
  return (
    <ViewGap gap={4}>
      <Checkbox
        label="J’ai lu et j’accepte les conditions générales d’utilisation"
        isChecked={isChecked}
        onPress={() => setIsChecked(!isChecked)}
        required
      />
      <ButtonContainerFlexStart>
        <ExternalTouchableLink
          as={Button}
          wording="Nos conditions générales d’utilisation"
          externalNav={{ url: env.CGU_LINK }}
          icon={ExternalSiteFilled}
          variant="tertiary"
          color="neutral"
          size="small"
        />
      </ButtonContainerFlexStart>
    </ViewGap>
  )
}
