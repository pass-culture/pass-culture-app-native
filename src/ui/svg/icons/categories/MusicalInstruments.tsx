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

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from '../types'

export const MusicalInstruments: React.FunctionComponent<AccessibleIcon> = ({
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const { id: gradientId1, fill: gradientFill1 } = svgIdentifier()
  const { id: gradientId2, fill: gradientFill2 } = svgIdentifier()
  const { id: gradientId3, fill: gradientFill3 } = svgIdentifier()
  const { id: gradientId4, fill: gradientFill4 } = svgIdentifier()
  const { id: gradientId5, fill: gradientFill5 } = svgIdentifier()
  const { id: gradientId6, fill: gradientFill6 } = svgIdentifier()
  const { id: gradientId7, fill: gradientFill7 } = svgIdentifier()
  const { id: gradientId8, fill: gradientFill8 } = svgIdentifier()
  const { id: gradientId9, fill: gradientFill9 } = svgIdentifier()
  const { id: gradientId10, fill: gradientFill10 } = svgIdentifier()
  const { id: gradientId11, fill: gradientFill11 } = svgIdentifier()
  const { id: gradientId12, fill: gradientFill12 } = svgIdentifier()
  const { id: gradientId13, fill: gradientFill13 } = svgIdentifier()
  const { id: gradientId14, fill: gradientFill14 } = svgIdentifier()
  const { id: gradientId15, fill: gradientFill15 } = svgIdentifier()
  const { id: gradientId16, fill: gradientFill16 } = svgIdentifier()
  const { id: gradientId17, fill: gradientFill17 } = svgIdentifier()
  const { id: gradientId18, fill: gradientFill18 } = svgIdentifier()
  const { id: gradientId19, fill: gradientFill19 } = svgIdentifier()
  const { id: gradientId20, fill: gradientFill20 } = svgIdentifier()
  const { id: gradientId21, fill: gradientFill21 } = svgIdentifier()
  const { id: clipPathId, fill: clipPath } = svgIdentifier()

  return (
    <AccessibleSvg
      width={156}
      height={92}
      viewBox="0 0 156 92"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G clipPath={clipPath}>
        <Path
          d="M60.8227 21.0342L-13.1363 40.8514C-15.2702 41.4232 -16.5365 43.6166 -15.9647 45.7504L-5.84195 83.5291C-5.27018 85.663 -3.07684 86.9293 -0.942971 86.3575L73.016 66.5403C75.1498 65.9685 76.4162 63.7752 75.8444 61.6413L65.7216 23.8626C65.1499 21.7288 62.9565 20.4624 60.8227 21.0342Z"
          fill={gradientFill}
        />
        <Path
          d="M58.7831 24.7896L-12.065 43.7733C-14.1989 44.3451 -15.4652 46.5384 -14.8934 48.6723L-12.4383 57.8349C-11.8665 59.9688 -9.6732 61.2351 -7.53934 60.6634L63.3087 41.6797C65.4426 41.1079 66.7089 38.9146 66.1371 36.7807L63.682 27.6181C63.1103 25.4842 60.9169 24.2179 58.7831 24.7896Z"
          fill={gradientFill1}
        />
        <Path
          d="M69.4282 43.1898L-3.27246 62.6699L2.17501 83.0002C2.31795 83.5336 2.86629 83.8502 3.39975 83.7073L74.1686 64.7448C74.702 64.6019 75.0186 64.0535 74.8757 63.5201L69.4282 43.1898Z"
          fill={gradientFill2}
        />
        <Path
          d="M1.86882 61.2916L-7.67773 63.8496L-2.6238 82.7111C-2.48086 83.2446 -1.93253 83.5612 -1.39906 83.4182L6.21564 81.3779C6.74911 81.2349 7.06569 80.6866 6.92275 80.1531L1.86882 61.2916Z"
          fill={gradientFill3}
        />
        <Path
          d="M12.8835 58.3404L3.33691 60.8984L8.39085 79.76C8.53379 80.2934 9.08212 80.61 9.61559 80.4671L17.2303 78.4267C17.7638 78.2838 18.0803 77.7354 17.9374 77.202L12.8835 58.3404Z"
          fill={gradientFill4}
        />
        <Path
          d="M12.8837 58.3404L9.21191 59.3242L13.282 74.514C13.4249 75.0475 13.9733 75.364 14.5067 75.2211L16.2466 74.7549C16.7801 74.612 17.0967 74.0636 16.9538 73.5302L12.8837 58.3404Z"
          fill={gradientFill5}
        />
        <Path
          d="M1.86804 61.2915L-1.80371 62.2754L2.26638 77.4652C2.40932 77.9986 2.95766 78.3152 3.49112 78.1723L5.23102 77.7061C5.76449 77.5631 6.08107 77.0148 5.93813 76.4813L1.86804 61.2915Z"
          fill={gradientFill6}
        />
        <Path
          d="M23.8991 55.3893L14.3525 57.9473L19.4065 76.8088C19.5494 77.3423 20.0977 77.6588 20.6312 77.5159L28.2459 75.4755C28.7794 75.3326 29.096 74.7843 28.953 74.2508L23.8991 55.3893Z"
          fill={gradientFill7}
        />
        <Path
          d="M34.9137 52.4381L25.3672 54.9961L30.4211 73.8576C30.5641 74.3911 31.1124 74.7077 31.6459 74.5647L39.2606 72.5244C39.794 72.3814 40.1106 71.8331 39.9677 71.2996L34.9137 52.4381Z"
          fill={gradientFill8}
        />
        <Path
          d="M34.9139 52.438L31.2422 53.4219L35.3123 68.6117C35.4552 69.1451 36.0036 69.4617 36.537 69.3188L38.2769 68.8526C38.8104 68.7096 39.127 68.1613 38.984 67.6278L34.9139 52.438Z"
          fill={gradientFill9}
        />
        <Path
          d="M40.0299 71.5299L30.4834 74.0879C30.5921 74.4935 31.0089 74.7341 31.4145 74.6255L39.4924 72.461C39.8979 72.3523 40.1386 71.9355 40.0299 71.5299Z"
          fill={gradientFill10}
        />
        <Path
          d="M29.0153 74.4811L19.4688 77.0391C19.5774 77.4446 19.9943 77.6853 20.3999 77.5766L28.4777 75.4122C28.8833 75.3035 29.124 74.8866 29.0153 74.4811Z"
          fill={gradientFill11}
        />
        <Path
          d="M17.9997 77.4342L8.45312 79.9922C8.5618 80.3978 8.97867 80.6384 9.38424 80.5298L17.4621 78.3653C17.8677 78.2566 18.1083 77.8398 17.9997 77.4342Z"
          fill={gradientFill12}
        />
        <Path
          d="M6.98405 80.3854L-2.5625 82.9434C-2.45383 83.3489 -2.03695 83.5896 -1.63138 83.4809L6.44647 81.3165C6.85204 81.2078 7.09272 80.7909 6.98405 80.3854Z"
          fill={gradientFill13}
        />
        <Path
          d="M45.9294 49.485L36.3828 52.043L41.4367 70.9045C41.5797 71.438 42.128 71.7545 42.6615 71.6116L50.2762 69.5712C50.8097 69.4283 51.1262 68.88 50.9833 68.3465L45.9294 49.485Z"
          fill={gradientFill14}
        />
        <Path
          d="M45.9296 49.4849L42.2578 50.4688L46.3279 65.6585C46.4708 66.192 47.0192 66.5086 47.5526 66.3656L49.2925 65.8994C49.826 65.7565 50.1426 65.2081 49.9997 64.6747L45.9296 49.4849Z"
          fill={gradientFill15}
        />
        <Path
          d="M67.9596 43.5826L58.4131 46.1406L63.467 65.0022C63.61 65.5356 64.1583 65.8522 64.6918 65.7093L72.3065 63.6689C72.8399 63.526 73.1565 62.9776 73.0136 62.4442L67.9596 43.5826Z"
          fill={gradientFill16}
        />
        <Path
          d="M73.0758 62.6764L63.5293 65.2344C63.638 65.6399 64.0548 65.8806 64.4604 65.772L72.5383 63.6075C72.9438 63.4988 73.1845 63.082 73.0758 62.6764Z"
          fill={gradientFill17}
        />
        <Path
          d="M56.945 46.5338L47.3984 49.0918L52.4524 67.9533C52.5953 68.4868 53.1436 68.8034 53.6771 68.6604L61.2918 66.6201C61.8253 66.4771 62.1419 65.9288 61.9989 65.3953L56.945 46.5338Z"
          fill={gradientFill18}
        />
        <Path
          d="M62.0602 65.6276L52.5137 68.1855C52.6223 68.5911 53.0392 68.8318 53.4448 68.7231L61.5226 66.5587C61.9282 66.45 62.1689 66.0331 62.0602 65.6276Z"
          fill={gradientFill19}
        />
        <Path
          d="M51.0456 68.5787L41.499 71.1367C41.6077 71.5423 42.0246 71.783 42.4301 71.6743L50.508 69.5098C50.9136 69.4012 51.1542 68.9843 51.0456 68.5787Z"
          fill={gradientFill20}
        />
        <Path
          d="M56.9442 46.5337L53.2725 47.5176L57.3425 62.7074C57.4855 63.2408 58.0338 63.5574 58.5673 63.4145L60.3072 62.9483C60.8407 62.8053 61.1572 62.257 61.0143 61.7235L56.9442 46.5337Z"
          fill={gradientFill21}
        />
        <Path
          d="M5.53984 60.3087L-0.334961 61.8828L3.34159 75.6039C3.48453 76.1374 4.03287 76.4539 4.56633 76.311L8.50928 75.2545C9.04275 75.1115 9.35933 74.5632 9.21639 74.0297L5.53984 60.3087Z"
          fill="#8BEBFF"
        />
        <Path
          d="M16.5555 57.3555L10.6807 58.9297L14.3572 72.6508C14.5002 73.1842 15.0485 73.5008 15.582 73.3579L19.5249 72.3014C20.0584 72.1584 20.375 71.6101 20.232 71.0766L16.5555 57.3555Z"
          fill="#8BEBFF"
        />
        <Path
          d="M49.6014 48.5001L43.7266 50.0742L47.4031 63.7953C47.5461 64.3288 48.0944 64.6453 48.6279 64.5024L52.5708 63.4459C53.1043 63.3029 53.4209 62.7546 53.2779 62.2211L49.6014 48.5001Z"
          fill="#8BEBFF"
        />
        <Path
          d="M59.8816 45.7462L54.0068 47.3203L57.6834 61.0414C57.8263 61.5749 58.3747 61.8914 58.9081 61.7485L62.8511 60.692C63.3845 60.549 63.7011 60.0007 63.5582 59.4672L59.8816 45.7462Z"
          fill="#8BEBFF"
        />
        <Path
          d="M38.5857 51.4532L32.7109 53.0273L36.3875 66.7484C36.5304 67.2819 37.0788 67.5985 37.6122 67.4555L41.5552 66.399C42.0886 66.2561 42.4052 65.7077 42.2623 65.1743L38.5857 51.4532Z"
          fill="#8BEBFF"
        />
        <Path
          d="M1.86809 61.2925L-0.334961 61.8828L3.34159 75.6039C3.48453 76.1374 4.03287 76.4539 4.56633 76.311L8.50928 75.2545C9.04275 75.1115 9.35933 74.5632 9.21639 74.0297L8.78652 72.4254L7.04662 72.8916C5.97969 73.1775 4.88302 72.5444 4.59713 71.4774L1.86809 61.2925Z"
          fill="#95EAFF"
        />
        <Path
          d="M1.86809 61.2925L-0.334961 61.8828L3.34159 75.6039C3.48453 76.1374 4.03287 76.4539 4.56633 76.311L8.50928 75.2545C9.04275 75.1115 9.35933 74.5632 9.21639 74.0297L8.78652 72.4254L7.04662 72.8916C5.97969 73.1775 4.88302 72.5444 4.59713 71.4774L1.86809 61.2925Z"
          fill="#0051CB"
          fillOpacity={0.2}
        />
        <Path
          d="M12.8837 58.3394L10.6807 58.9297L14.3572 72.6508C14.5002 73.1842 15.0485 73.5008 15.582 73.3579L19.5249 72.3014C20.0584 72.1584 20.375 71.6101 20.232 71.0766L19.8021 69.4723L18.0622 69.9385C16.9953 70.2244 15.8986 69.5912 15.6128 68.5243L12.8837 58.3394Z"
          fill="#95EAFF"
        />
        <Path
          d="M12.8837 58.3394L10.6807 58.9297L14.3572 72.6508C14.5002 73.1842 15.0485 73.5008 15.582 73.3579L19.5249 72.3014C20.0584 72.1584 20.375 71.6101 20.232 71.0766L19.8021 69.4723L18.0622 69.9385C16.9953 70.2244 15.8986 69.5912 15.6128 68.5243L12.8837 58.3394Z"
          fill="#0051CB"
          fillOpacity={0.2}
        />
        <Path
          d="M34.914 52.437L32.7109 53.0273L36.3875 66.7484C36.5304 67.2819 37.0788 67.5985 37.6122 67.4555L41.5552 66.399C42.0886 66.2561 42.4052 65.7077 42.2623 65.1743L41.8324 63.57L40.0925 64.0362C39.0256 64.3221 37.9289 63.6889 37.643 62.622L34.914 52.437Z"
          fill="#95EAFF"
        />
        <Path
          d="M34.914 52.437L32.7109 53.0273L36.3875 66.7484C36.5304 67.2819 37.0788 67.5985 37.6122 67.4555L41.5552 66.399C42.0886 66.2561 42.4052 65.7077 42.2623 65.1743L41.8324 63.57L40.0925 64.0362C39.0256 64.3221 37.9289 63.6889 37.643 62.622L34.914 52.437Z"
          fill="#0051CB"
          fillOpacity={0.2}
        />
        <Path
          d="M45.9296 49.4859L43.7266 50.0762L47.4031 63.7972C47.5461 64.3307 48.0944 64.6473 48.6279 64.5044L52.5708 63.4478C53.1043 63.3049 53.4209 62.7566 53.2779 62.2231L52.848 60.6188L51.1081 61.085C50.0412 61.3709 48.9445 60.7377 48.6587 59.6708L45.9296 49.4859Z"
          fill="#95EAFF"
        />
        <Path
          d="M45.9296 49.4859L43.7266 50.0762L47.4031 63.7972C47.5461 64.3307 48.0944 64.6473 48.6279 64.5044L52.5708 63.4478C53.1043 63.3049 53.4209 62.7566 53.2779 62.2231L52.848 60.6188L51.1081 61.085C50.0412 61.3709 48.9445 60.7377 48.6587 59.6708L45.9296 49.4859Z"
          fill="#0051CB"
          fillOpacity={0.2}
        />
        <Path
          d="M56.2099 46.73L54.0068 47.3203L57.6834 61.0414C57.8263 61.5749 58.3747 61.8914 58.9081 61.7485L62.8511 60.692C63.3845 60.549 63.7011 60.0007 63.5582 59.4672L63.1283 57.8629L61.3884 58.3291C60.3215 58.615 59.2248 57.9819 58.9389 56.9149L56.2099 46.73Z"
          fill="#95EAFF"
        />
        <Path
          d="M56.2099 46.73L54.0068 47.3203L57.6834 61.0414C57.8263 61.5749 58.3747 61.8914 58.9081 61.7485L62.8511 60.692C63.3845 60.549 63.7011 60.0007 63.5582 59.4672L63.1283 57.8629L61.3884 58.3291C60.3215 58.615 59.2248 57.9819 58.9389 56.9149L56.2099 46.73Z"
          fill="#0051CB"
          fillOpacity={0.2}
        />
      </G>
      <Defs>
        <LinearGradient
          id={gradientId}
          x1={3.24768}
          y1={50.1637}
          x2={71.3059}
          y2={29.3623}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#C1F3FF" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <LinearGradient
          id={gradientId1}
          x1={18.7124}
          y1={59.5323}
          x2={26.5563}
          y2={5.09011}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#C1F3FF" />
          <Stop offset={0.718043} stopColor="white" />
        </LinearGradient>
        <LinearGradient
          id={gradientId2}
          x1={69.7182}
          y1={60.4278}
          x2={-2.51753}
          y2={83.1259}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#C1F3FF" />
          <Stop offset={1} stopColor="#C1F3FF" />
        </LinearGradient>
        <RadialGradient
          id={gradientId3}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(6.73547 80.6833) rotate(-150.516) scale(31.0754 41.0876)">
          <Stop offset={0.354167} stopColor="white" />
          <Stop offset={1} stopColor="#C1F3FF" />
        </RadialGradient>
        <RadialGradient
          id={gradientId4}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(17.7501 77.7321) rotate(-150.516) scale(31.0754 41.0876)">
          <Stop offset={0.354167} stopColor="white" />
          <Stop offset={1} stopColor="#C1F3FF" />
        </RadialGradient>
        <LinearGradient
          id={gradientId5}
          x1={11.0478}
          y1={58.8323}
          x2={15.3767}
          y2={74.988}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={0.729167} stopColor="#C1F3FF" />
        </LinearGradient>
        <LinearGradient
          id={gradientId6}
          x1={0.0321642}
          y1={61.7835}
          x2={4.36107}
          y2={77.9392}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={0.729167} stopColor="#C1F3FF" />
        </LinearGradient>
        <RadialGradient
          id={gradientId7}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(28.7657 74.781) rotate(-150.516) scale(31.0754 41.0876)">
          <Stop offset={0.354167} stopColor="white" />
          <Stop offset={1} stopColor="#C1F3FF" />
        </RadialGradient>
        <RadialGradient
          id={gradientId8}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(39.7804 71.8298) rotate(-150.516) scale(31.0754 41.0876)">
          <Stop offset={0.354167} stopColor="white" />
          <Stop offset={1} stopColor="#C1F3FF" />
        </RadialGradient>
        <LinearGradient
          id={gradientId9}
          x1={33.0781}
          y1={52.93}
          x2={37.407}
          y2={69.0857}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={0.729167} stopColor="#C1F3FF" />
        </LinearGradient>
        <LinearGradient
          id={gradientId10}
          x1={35.2567}
          y1={72.8089}
          x2={35.4534}
          y2={73.5432}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={0.729167} stopColor="#C1F3FF" />
        </LinearGradient>
        <LinearGradient
          id={gradientId11}
          x1={24.242}
          y1={75.7601}
          x2={24.4388}
          y2={76.4944}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={0.729167} stopColor="#C1F3FF" />
        </LinearGradient>
        <LinearGradient
          id={gradientId12}
          x1={13.2264}
          y1={78.7132}
          x2={13.4232}
          y2={79.4475}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={0.729167} stopColor="#C1F3FF" />
        </LinearGradient>
        <LinearGradient
          id={gradientId13}
          x1={2.21078}
          y1={81.6644}
          x2={2.40754}
          y2={82.3987}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={0.729167} stopColor="#C1F3FF" />
        </LinearGradient>
        <RadialGradient
          id={gradientId14}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(50.796 68.8767) rotate(-150.516) scale(31.0754 41.0876)">
          <Stop offset={0.354167} stopColor="white" />
          <Stop offset={1} stopColor="#C1F3FF" />
        </RadialGradient>
        <LinearGradient
          id={gradientId15}
          x1={44.0937}
          y1={49.9768}
          x2={48.4226}
          y2={66.1325}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={0.729167} stopColor="#C1F3FF" />
        </LinearGradient>
        <RadialGradient
          id={gradientId16}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(72.8263 62.9743) rotate(-150.516) scale(31.0754 41.0876)">
          <Stop offset={0.354167} stopColor="white" />
          <Stop offset={1} stopColor="#C1F3FF" />
        </RadialGradient>
        <LinearGradient
          id={gradientId17}
          x1={68.3026}
          y1={63.9554}
          x2={68.4993}
          y2={64.6897}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={0.729167} stopColor="#C1F3FF" />
        </LinearGradient>
        <RadialGradient
          id={gradientId18}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(61.8116 65.9255) rotate(-150.516) scale(31.0754 41.0876)">
          <Stop offset={0.354167} stopColor="white" />
          <Stop offset={1} stopColor="#C1F3FF" />
        </RadialGradient>
        <LinearGradient
          id={gradientId19}
          x1={57.2869}
          y1={66.9066}
          x2={57.4837}
          y2={67.6409}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={0.729167} stopColor="#C1F3FF" />
        </LinearGradient>
        <LinearGradient
          id={gradientId20}
          x1={46.2723}
          y1={69.8577}
          x2={46.4691}
          y2={70.5921}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={0.729167} stopColor="#C1F3FF" />
        </LinearGradient>
        <LinearGradient
          id={gradientId21}
          x1={55.1083}
          y1={47.0257}
          x2={59.4372}
          y2={63.1814}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={0.729167} stopColor="#C1F3FF" />
        </LinearGradient>
        <ClipPath id={clipPathId}>
          <Rect width={156} height={92} fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}
