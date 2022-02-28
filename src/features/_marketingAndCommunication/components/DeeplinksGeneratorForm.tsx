import { t } from '@lingui/macro'
import omit from 'lodash.omit'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components/native'

import {
  FDL_CONFIG,
  MARKETING_CONFIG,
  SCREENS_CONFIG,
  ScreensUsedByMarketing,
  ParamConfig,
} from 'features/_marketingAndCommunication/config/deeplinksExportConfig'
import { generateLongFirebaseDynamicLink } from 'features/deeplinks'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { isTabScreen } from 'features/navigation/TabBar/routes'
import { env } from 'libs/environment'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { RadioButton } from 'ui/components/RadioButton'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Warning as WarningDefault } from 'ui/svg/icons/Warning'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export interface GeneratedDeeplink {
  universalLink: string
  firebaseLink: string
}

interface Props {
  onCreate: (generatedDeeplink: GeneratedDeeplink) => void
}

export const DeeplinksGeneratorForm = ({ onCreate }: Props) => {
  const [selectedScreen, setSelectedScreen] = useState<ScreensUsedByMarketing>('Offer')
  const [screenParams, setScreenParams] = useState<Record<string, string>>({})

  const { showErrorSnackBar } = useSnackBarContext()

  const renderScreenItem = (screenName: ScreensUsedByMarketing) => {
    return (
      <React.Fragment key={screenName}>
        <Spacer.Column numberOfSpaces={2} />
        <RadioButton
          id={screenName}
          title={screenName}
          onSelect={() => {
            setSelectedScreen(screenName)
            setScreenParams({})
          }}
          selectedValue={selectedScreen}
        />
        <Spacer.Column numberOfSpaces={2} />
        <Separator />
      </React.Fragment>
    )
  }

  const renderScreenParam = (name: string, config: ParamConfig) => {
    function validate(value: string) {
      if (config.serverValidator) {
        config.serverValidator(value).catch((error) => {
          showErrorSnackBar({
            message: `${name} invalide : ${error.message}`,
            timeout: SNACK_BAR_TIME_OUT,
          })
        })
      }
    }

    return (
      <React.Fragment key={name}>
        <Spacer.Column numberOfSpaces={2} />
        {config.type === 'string' && (
          <TextInput
            placeholder={config.required ? `${name} (*)` : name}
            onBlur={() => {
              const value: string = screenParams[name]
              !!value && validate(value)
            }}
            onChangeText={(text) =>
              setScreenParams((prevPageParams) =>
                text.length === 0
                  ? omit(prevPageParams, name)
                  : {
                      ...prevPageParams,
                      [name]: text,
                    }
              )
            }
          />
        )}
        {!!config.description && (
          <DescriptionContainer>
            <StyledCaption>{config.description}</StyledCaption>
          </DescriptionContainer>
        )}
        <Separator />
      </React.Fragment>
    )
  }

  function areAllParamsValid() {
    const screenConfig = SCREENS_CONFIG[selectedScreen]
    for (const [paramName, paramConfig] of Object.entries(screenConfig)) {
      if (paramConfig.required && !screenParams[paramName]) {
        return false
      }
    }
    return true
  }

  function onPress() {
    if (!areAllParamsValid()) return

    const { appParams, marketingParams, fdlParams } = extractParams(screenParams)
    const appAndMarketingParams = { ...appParams, ...marketingParams }

    let screenPath = getScreenPath(selectedScreen, appAndMarketingParams)
    if (isTabScreen(selectedScreen)) {
      const tabNavConfig = getTabNavConfig(selectedScreen, appAndMarketingParams)
      screenPath = getScreenPath(...tabNavConfig)
    }

    let universalLink = `https://${env.WEBAPP_V2_DOMAIN}${screenPath}`
    let firebaseLink = generateLongFirebaseDynamicLink(universalLink, fdlParams)

    if (selectedScreen === 'Search' && appParams.URL) {
      universalLink = appParams.URL
      firebaseLink = generateLongFirebaseDynamicLink(universalLink, fdlParams)
    }

    onCreate({ universalLink, firebaseLink })
  }

  const paramsCount = useMemo(() => {
    const screenConfig = SCREENS_CONFIG[selectedScreen]
    return Object.keys(screenConfig).length
  }, [selectedScreen])

  const disabled = !areAllParamsValid()

  useEnterKeyAction(!disabled ? onPress : undefined)

  return (
    <React.Fragment>
      <Container>
        <TitleContainer>{t`Besoin d'un lien\u00a0?`}</TitleContainer>
        <Spacer.Column numberOfSpaces={6} />
        <AccordionItem title={t`Pages`} defaultOpen>
          {Object.keys(SCREENS_CONFIG).map((key) =>
            renderScreenItem(key as ScreensUsedByMarketing)
          )}
        </AccordionItem>
        {paramsCount > 0 && (
          <AccordionItem title={t`Paramètres applicatifs` + ` (${paramsCount})`} defaultOpen>
            {Object.entries(SCREENS_CONFIG).map(([page, config]) => (
              <React.Fragment key={page}>
                {page === selectedScreen
                  ? Object.entries(config).map(([name, config]) => renderScreenParam(name, config))
                  : null}
              </React.Fragment>
            ))}
          </AccordionItem>
        )}
        <AccordionItem title={t`Paramètres marketing`} defaultOpen>
          {Object.entries(SCREENS_CONFIG).map(([page]) => (
            <React.Fragment key={page}>
              {page === selectedScreen
                ? Object.entries(MARKETING_CONFIG).map(([name, config]) =>
                    renderScreenParam(name, config)
                  )
                : null}
            </React.Fragment>
          ))}
        </AccordionItem>
        <AccordionItem title={t`Paramètres firebase dynamic link`}>
          {Object.keys(SCREENS_CONFIG).map((page) => (
            <React.Fragment key={page}>
              {page === selectedScreen
                ? Object.entries(FDL_CONFIG).map(([name, config]) =>
                    renderScreenParam(name, config)
                  )
                : null}
            </React.Fragment>
          ))}
        </AccordionItem>
      </Container>
      <BottomContainer>
        <ErrorBanner>
          <Warning />
          {t`Seulement les "ids" disposent de validation\u00a0!`}
        </ErrorBanner>
        <ButtonPrimary wording={t`Générer le lien`} disabled={disabled} onPress={onPress} />
      </BottomContainer>
    </React.Fragment>
  )
}

function extractParams(params: Record<string, string>) {
  const appParams: Record<string, string> = {}
  const marketingParams: Record<string, string> = {}
  const fdlParams: Record<string, string> = {}
  for (const [paramName, paramValue] of Object.entries(params)) {
    if (paramName in FDL_CONFIG) fdlParams[paramName] = paramValue
    else if (paramName in MARKETING_CONFIG) marketingParams[paramName] = paramValue
    else appParams[paramName] = paramValue
  }
  return { appParams, marketingParams, fdlParams }
}

const Container = styled.ScrollView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
  flexDirection: 'column',
}))

const ErrorBanner = styled(Typo.Caption)(({ theme }) => ({
  paddingVertical: getSpacing(1.5),
  color: theme.colors.error,
}))

const TitleContainer = styled(Typo.Title4)({
  textAlign: 'center',
})

const BottomContainer = styled.View({
  paddingHorizontal: getSpacing(5),
  paddingVertical: getSpacing(4),
  alignItems: 'center',
})

const DescriptionContainer = styled.View({
  padding: getSpacing(5),
})

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyMedium,
}))

const Warning = styled(WarningDefault).attrs(({ theme }) => ({
  color: theme.colors.error,
  size: theme.icons.sizes.extraSmall,
}))``
