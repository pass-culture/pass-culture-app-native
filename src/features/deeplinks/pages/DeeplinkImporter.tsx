import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'

import { resolveHandler } from 'features/deeplinks'
import { useDeeplinkUrlHandler } from 'features/deeplinks/useDeeplinkUrlHandler'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const DeeplinkImporter: FunctionComponent = () => {
  const [url, setUrl] = useState('')
  const handleDeeplinkUrl = useDeeplinkUrlHandler()
  const { goBack } = useGoBack(...homeNavConfig)

  function resolveLink() {
    if (url.length > 0) {
      resolveHandler(handleDeeplinkUrl, true)({ url })
      analytics.logProblemWithLink(url)
    } else {
      setHasError(true)
    }
  }

  const [hasError, setHasError] = useState(false)
  const urlInput = useRef<RNTextInput | null>(null)

  return (
    <BottomContentPage>
      <ModalHeader
        title={t`Accès aux liens`}
        leftIconAccessibilityLabel={t`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={undefined}
        rightIcon={undefined}
        onRightIconPress={undefined}
      />
      <ModalContent>
        <StyledInput>
          <Typo.Body>{t`Un lien ne fonctionne pas ?`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <TextInput
            autoFocus={true}
            onChangeText={setUrl}
            placeholder={t`Colle ton lien ici ...`}
            ref={urlInput}
            value={url}
          />
          <InputError
            visible={hasError}
            messageId={t`Format du lien incorrect`}
            numberOfSpacesTop={1}
          />
        </StyledInput>
        <Spacer.Column numberOfSpaces={4} />
        <Typo.Caption color={ColorsEnum.GREY_DARK}>
          {t`Copie ici le lien qui t'a été envoyé par email et clique sur le bouton "Importer le lien"`}
        </Typo.Caption>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary title={t`Importer le lien`} onPress={resolveLink} isLoading={false} />
        <Spacer.Column numberOfSpaces={3} />
      </ModalContent>
    </BottomContentPage>
  )
}

const ModalContent = styled.View({
  paddingTop: getSpacing(7),
  alignItems: 'center',
  width: '100%',
  maxWidth: getSpacing(125),
})

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
})
