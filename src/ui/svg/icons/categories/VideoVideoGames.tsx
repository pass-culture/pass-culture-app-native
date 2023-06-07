import * as React from 'react'
import {
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  Rect,
  RadialGradient,
} from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

const VideoVideoGamesSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 269 112"
      accessibilityLabel={accessibilityLabel}
      fill="none"
      testID={testID}>
      <G clipPath="url(#clip0_1909_1029)">
        <Path
          d="M38.1279 35.5644C37.958 34.8104 38.4315 34.0615 39.1855 33.8916L46.2105 32.3088C46.9645 32.1389 47.7135 32.6124 47.8834 33.3664L38.1279 35.5644Z"
          fill="#FBDBAC"
        />
        <Path
          d="M5.48924 42.8867C5.31936 42.1327 5.79287 41.3838 6.54686 41.2139L13.5719 39.6311C14.3259 39.4612 15.0748 39.9347 15.2447 40.6887L5.48924 42.8867Z"
          fill="#FBDBAC"
        />
        <Path
          d="M62.8016 76.276L61.9592 76.4682C58.8297 77.1822 55.5634 76.3529 53.2614 74.2479L43.8931 65.7172C43.3183 65.1937 42.5014 64.985 41.7175 65.1638L25.5022 68.8635C24.7184 69.0423 24.0729 69.5847 23.7819 70.3057L19.0408 82.0556C17.8726 84.9465 15.2964 87.1147 12.1668 87.8288L11.3245 88.021C6.15334 89.2008 1.04925 86.1429 -0.0813336 81.1876L-5.06921 59.3262C-6.76381 51.8989 -1.85027 44.4383 5.90055 42.6699L48.0182 33.0604C55.769 31.2919 63.4323 35.8831 65.1269 43.3104L70.1148 65.1718C71.2453 70.127 67.9727 75.0962 62.8016 76.276Z"
          fill="url(#paint0_radial_1909_1029)"
        />
        <Path
          opacity={0.4}
          d="M38.0335 54.2832L24.1018 57.4618C23.4681 57.6064 22.9052 57.5002 22.8422 57.2242L20.7525 48.0654C20.6896 47.7894 21.1507 47.4496 21.7844 47.305L35.7161 44.1263C36.3499 43.9818 36.9128 44.0879 36.9758 44.3639L39.0654 53.5227C39.1284 53.7987 38.6672 54.1386 38.0335 54.2832Z"
          fill="url(#paint1_radial_1909_1029)"
        />
        <Path
          d="M28.6885 35.1706L24.0088 36.2383L24.5442 38.5851L29.224 37.5173L28.6885 35.1706Z"
          fill="url(#paint2_linear_1909_1029)"
        />
        <Path
          d="M26.3488 35.7057L25.4836 31.8796C21.1586 16.3011 -8.1753 25.4474 -1.60394 38.7508"
          stroke="url(#paint3_linear_1909_1029)"
          strokeWidth={4}
          strokeMiterlimit={10}
        />
        <Path
          d="M49.1881 43.5816C50.4804 43.2867 51.2882 41.997 50.9925 40.7009C50.6968 39.4048 49.4095 38.5932 48.1172 38.888C46.8249 39.1829 46.0171 40.4726 46.3128 41.7686C46.6085 43.0647 47.8958 43.8764 49.1881 43.5816Z"
          fill="#FBDBAC"
        />
        <Path
          d="M51.8648 55.3159C53.1571 55.0211 53.965 53.7314 53.6693 52.4353C53.3736 51.1392 52.0862 50.3275 50.794 50.6224C49.5017 50.9172 48.6938 52.2069 48.9895 53.503C49.2853 54.7991 50.5726 55.6108 51.8648 55.3159Z"
          fill="#FBDBAC"
        />
        <Path
          d="M44.6773 50.7847C45.9696 50.4898 46.7775 49.2001 46.4818 47.904C46.1861 46.608 44.8987 45.7963 43.6065 46.0911C42.3142 46.386 41.5063 47.6757 41.802 48.9718C42.0978 50.2679 43.3851 51.0795 44.6773 50.7847Z"
          fill="#FBDBAC"
        />
        <Path
          d="M56.3766 48.1128C57.6688 47.818 58.4767 46.5283 58.181 45.2322C57.8853 43.9361 56.598 43.1244 55.3057 43.4193C54.0134 43.7141 53.2055 45.0038 53.5013 46.2999C53.797 47.596 55.0843 48.4077 56.3766 48.1128Z"
          fill="#FBDBAC"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.69901 62.4658C9.93372 63.4945 10.9534 64.1357 11.9756 63.9024C12.9978 63.6692 13.6385 62.6492 13.4038 61.6205L12.4894 57.6129L16.4878 56.7006C17.51 56.4674 18.1507 55.4474 17.916 54.4187C17.6813 53.39 16.6616 52.7488 15.6394 52.982L11.641 53.8943L10.7266 49.8866C10.4919 48.8579 9.47221 48.2168 8.45 48.45C7.4278 48.6832 6.78711 49.7032 7.02182 50.7319L7.9362 54.7396L3.94002 55.6513C2.91782 55.8846 2.27712 56.9046 2.51184 57.9333C2.74655 58.962 3.76625 59.6032 4.78845 59.3699L8.78464 58.4582L9.69901 62.4658Z"
          fill="#FBDBAC"
        />
        <Path
          d="M32.2151 50.109L32.4025 50.9304C32.4989 51.3528 32.2372 51.7705 31.816 51.8666L28.6572 52.5873C28.236 52.6834 27.8191 52.4206 27.7227 51.9981L27.5353 51.1768C27.439 50.7543 27.7006 50.3367 28.1218 50.2406L31.2806 49.5198C31.7018 49.4237 32.1187 49.6866 32.2151 50.109Z"
          fill="#FBDBAC"
        />
      </G>
      <Defs>
        <RadialGradient
          id="paint0_radial_1909_1029"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(45.5 36.999) rotate(124.33) scale(74.4732 70.049)">
          <Stop offset={0.120155} stopColor="white" />
          <Stop offset={0.844854} stopColor="#FFF5D8" />
        </RadialGradient>
        <RadialGradient
          id="paint1_radial_1909_1029"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(29.9094 50.7939) rotate(129.151) scale(8.93477 7.64405)">
          <Stop offset={0.375} stopColor="white" />
          <Stop offset={1} stopColor="#FFF5D8" />
        </RadialGradient>
        <LinearGradient
          id="paint2_linear_1909_1029"
          x1={24.2765}
          y1={37.4117}
          x2={28.9562}
          y2={36.3439}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFF5D8" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <LinearGradient
          id="paint3_linear_1909_1029"
          x1={6.39606}
          y1={37.7539}
          x2={25.8961}
          y2={16.7539}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFF5D8" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <ClipPath id="clip0_1909_1029">
          <Rect width={268.5} height={112} fill="white" transform="translate(0.5)" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const VideoVideoGames = styled(VideoVideoGamesSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.illustrations.sizes.medium,
}))``
