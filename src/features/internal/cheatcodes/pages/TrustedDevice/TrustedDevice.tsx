import React, { useState, useEffect } from 'react'
import DeviceInfo from 'react-native-device-info'
import styled from 'styled-components/native'

import { getUniqueId } from 'libs/react-native-device-info/getUniqueId'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const TrustedDevice = () => {
  const [deviceModel, setDeviceModel] = useState('')
  const [deviceVersion, setDeviceVersion] = useState('')
  const [deviceBrand, setDeviceBrand] = useState('')
  const [deviceSystemName, setDeviceSystemName] = useState('')
  const [deviceSystemVersion, setDeviceSystemVersion] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [deviceOs, setDeviceOs] = useState('')
  const [deviceName, setDeviceName] = useState('')

  useEffect(() => {
    setDeviceModel(DeviceInfo.getModel())
    setDeviceVersion(DeviceInfo.getSystemVersion())
    setDeviceBrand(DeviceInfo.getBrand())
    setDeviceSystemName(DeviceInfo.getSystemName())
    setDeviceSystemVersion(DeviceInfo.getSystemVersion())
    getUniqueId().then((deviceId) => setDeviceId(deviceId))
    DeviceInfo.getBaseOs().then((baseOs) => setDeviceOs(baseOs))
    DeviceInfo.getDeviceName().then((deviceName) => setDeviceName(deviceName))
  }, [])

  return (
    <React.Fragment>
      <PageHeaderSecondary title="Spike appareil de confiance" />
      <Spacer.Column numberOfSpaces={6} />
      <Container>
        <Typo.Title3>react-native-device-info</Typo.Title3>
        <Spacer.Column numberOfSpaces={2} />
        <Data title="Device Model" data={deviceModel} ios android />
        <Data title="Device Version" data={deviceVersion} ios android />
        <Data title="Device Brand" data={deviceBrand} ios android />
        <Data title="Device System Name" data={deviceSystemName} ios android />
        <Data title="Device System Version" data={deviceSystemVersion} ios android />
        <Data title="Device ID" data={deviceId} ios android web />
        <Data title="Device OS" data={deviceOs} android web />
        <Data title="Device Name" data={deviceName} ios android />
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))

type DataProps = {
  title: string
  data: string
  ios?: boolean
  android?: boolean
  web?: boolean
}

const Data = ({ title, data, ios, android, web }: DataProps) => {
  const dataColor = data === 'unknown' ? ColorsEnum.PRIMARY : ColorsEnum.GREEN_VALID

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.ButtonText>
        {title}{' '}
        <Typo.Body style={{ color: ColorsEnum.GREY_SEMI_DARK }}>
          {ios && '- ios '}
          {android && '- android '}
          {web && '- web'}
        </Typo.Body>
      </Typo.ButtonText>
      <Typo.ButtonText style={{ color: dataColor }}>{data}</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={2} />
    </React.Fragment>
  )
}
