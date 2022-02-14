import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const CarteJeunesSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      aria-hidden={!accessibilityLabel}>
      <Defs>
        <LinearGradient id={gradientId} x1="0%" x2="100%" y1="13.494%" y2="86.506%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M33.6527 7.07381C34.6509 6.80524 35.6822 7.40284 35.9491 8.40272L35.9491 8.40287L38.0201 16.1579C38.0412 16.2369 38.0712 16.3111 38.1085 16.3799H11.9634C9.67349 16.3799 7.98145 18.4185 7.98145 20.7195V24.9184V31.6836L4.06535 16.9838C3.79791 15.9817 4.39336 14.9463 5.38891 14.6781L8.34938 13.8848C8.88325 13.7417 9.20053 13.1912 9.05805 12.6552C8.91556 12.1192 8.36727 11.8006 7.8334 11.9437L4.87098 12.7375C2.8055 13.2933 1.57994 15.4323 2.13256 17.5038L6.07437 32.3001L6.07512 32.3029C6.36414 33.3754 7.07482 34.2227 7.98145 34.7147V38.6604C7.98145 40.947 9.65958 43 11.9634 43H42.0181C44.308 43 46 40.9614 46 38.6604V33.5373C46 32.9825 45.5521 32.5328 44.9995 32.5328C44.447 32.5328 43.999 32.9825 43.999 33.5373V38.6604C43.999 40.0561 43.0098 40.9909 42.0181 40.9909H11.9634C10.9656 40.9909 9.98242 40.0505 9.98242 38.6604V25.923H30.9927C31.5452 25.923 31.9932 25.4732 31.9932 24.9184C31.9932 24.3636 31.5452 23.9139 30.9927 23.9139H9.98242V20.7195C9.98242 19.3238 10.9717 18.389 11.9634 18.389H42.0081C43.0059 18.389 43.989 19.3294 43.989 20.7195V23.9139H38.9365C38.384 23.9139 37.936 24.3636 37.936 24.9184C37.936 25.4732 38.384 25.923 38.9365 25.923H43.989V26.8069C43.989 27.3617 44.437 27.8115 44.9895 27.8115C45.5421 27.8115 45.99 27.3617 45.99 26.8069V20.7195C45.99 18.4329 44.3119 16.3799 42.0081 16.3799H39.8642C39.9835 16.1611 40.0223 15.8975 39.9528 15.6375L37.8819 7.88269L37.8818 7.88255C37.3283 5.80875 35.1982 4.57818 33.1351 5.13314L33.1348 5.13321L13.8857 10.3065C13.3519 10.4499 13.035 11.0007 13.1779 11.5366C13.3208 12.0725 13.8693 12.3907 14.4031 12.2472L33.6525 7.07388L33.6527 7.07381ZM14.1443 36.1692C13.5917 36.1692 13.1438 36.6189 13.1438 37.1737C13.1438 37.7285 13.5917 38.1783 14.1443 38.1783H21.1477C21.7003 38.1783 22.1482 37.7285 22.1482 37.1737C22.1482 36.6189 21.7003 36.1692 21.1477 36.1692H14.1443Z"
      />
    </AccessibleSvg>
  )
}

export const CarteJeunes = styled(CarteJeunesSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.primary,
  size: size ?? theme.icons.sizes.standard,
}))``
