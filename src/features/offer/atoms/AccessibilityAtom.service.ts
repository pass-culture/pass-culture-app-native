import { t } from '@lingui/macro'

import { _ } from 'libs/i18n'
import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'
import { IconInterface } from 'ui/svg/icons/types'

export enum HandicapCategory {
  'VISUAL',
  'MENTAL',
  'MOTOR',
  'AUDIO',
}

export const getIconAndWording = (
  handicap: HandicapCategory
): { Icon: React.FC<IconInterface>; wording: string } => {
  switch (handicap) {
    case HandicapCategory.VISUAL:
      return { Icon: HandicapVisual, wording: _(t`Handicap visuel`) }
    case HandicapCategory.MENTAL:
      return { Icon: HandicapMental, wording: _(t`Handicap psychique ou cognitif`) }
    case HandicapCategory.MOTOR:
      return { Icon: HandicapMotor, wording: _(t`Handicap moteur`) }
    case HandicapCategory.AUDIO:
      return { Icon: HandicapAudio, wording: _(t`Handicap auditif`) }
  }
}
