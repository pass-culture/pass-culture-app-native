import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { ScrollView } from 'react-native'

import { _ } from 'libs/i18n'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

const AppComponents: FunctionComponent = () => {
  return (
    <ScrollView>
      {/* Typos */}
      <Typo.Title1 color={ColorsEnum.PRIMARY}>{_(t`Typos`)}</Typo.Title1>

      <Typo.Hero>{_(t`Hero`)}</Typo.Hero>
      <Typo.Title1>{_(t`Title 1`)}</Typo.Title1>
      <Typo.Title2>{_(t`Title 2`)}</Typo.Title2>
      <Typo.Title3>{_(t`Title 3`)}</Typo.Title3>
      <Typo.Title4>{_(t`Title 4`)}</Typo.Title4>
      <Typo.Body>{_(t`This is a body`)}</Typo.Body>
      <Typo.ButtonText>{_(t`This is a button text`)}</Typo.ButtonText>
      <Typo.Caption>{_(t`This is a caption`)}</Typo.Caption>
      <Spacer.Column numberOfSpaces={5} />

      {/* Buttons */}
      <Typo.Title1 color={ColorsEnum.PRIMARY}>{_(t`Buttons`)}</Typo.Title1>
      <Typo.Title4>{_(t`Button - Theme Primary`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4>{_(t`Button - Theme Secondary`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4>{_(t`Button - Theme Tertiary`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4>{_(t`Button - Theme Quaternary`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={5} />

      {/* Inputs */}
      <Typo.Title1 color={ColorsEnum.PRIMARY}>{_(t`Inputs`)}</Typo.Title1>
      <Typo.Title4>{_(t`Input - Any string`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4 color={ColorsEnum.TERTIARY}>{_(t`Input - Email input`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4>{_(t`Input - Email password`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={5} />

      {/* Modals */}
      <Typo.Title1 color={ColorsEnum.PRIMARY}>{_(t`Modals`)}</Typo.Title1>
      <Typo.Title4 color={ColorsEnum.TERTIARY}>{_(t`Modal - Basic`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4>{_(t`Modal - Progressive`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={5} />

      {/* Create your category */}
      <Typo.Title1 color={ColorsEnum.PRIMARY}>{_(t`Add components`)}</Typo.Title1>
      <Spacer.Column numberOfSpaces={5} />
    </ScrollView>
  )
}

export default AppComponents
