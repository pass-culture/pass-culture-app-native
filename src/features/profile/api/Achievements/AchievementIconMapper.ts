import { ImageURISource } from 'react-native'

import Explorer2 from '../../pages/Achievements/assets/explorer_2.png'
import Festival from '../../pages/Achievements/assets/festival.png'
import Fidelity from '../../pages/Achievements/assets/fidelity.png'
import Heart from '../../pages/Achievements/assets/heart.png'
import Info from '../../pages/Achievements/assets/info.png'
import Magic from '../../pages/Achievements/assets/magic.png'
import Maniac from '../../pages/Achievements/assets/maniac.png'
import Opera from '../../pages/Achievements/assets/opera.png'
import Rock from '../../pages/Achievements/assets/rock.png'
import Share from '../../pages/Achievements/assets/share.png'
import TwoIsBetter from '../../pages/Achievements/assets/two_is_better.png'
import Welcome from '../../pages/Achievements/assets/welcome.png'

export const achievementIconMapper: Record<string, ImageURISource> = {
  Info: Info,
  TwoIsBetter: TwoIsBetter,
  Welcome: Welcome,
  Profile: Explorer2,
  Heart: Heart,
  Maniac: Maniac,
  Share: Share,
  Rock: Rock,
  Magic: Magic,
  Festival: Festival,
  Opera: Opera,
  Fidelity: Fidelity,
}
