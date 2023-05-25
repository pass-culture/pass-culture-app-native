import { Color, HomepageModuleType, VideoModule } from 'features/home/types'

export const videoModuleFixture: VideoModule = {
  type: HomepageModuleType.VideoModule,
  id: '4ZzxHKDN7BvBAxVR6hFbU6',
  title: 'Découvre Lujipeka',
  videoTitle: 'Lujipeka répond à vos questions\u00a0!',
  videoThumbnail:
    'https://images.ctfassets.net/2bg01iqy0isv/326jseCDgaDNyOu4XAsBec/f338921eaae630381841d0eeeb84ce60/lujipeka',
  durationInMinutes: 2,
  youtubeVideoId: 'qE7xwEZnFP0',
  offersModuleParameters: {
    title: 'test music type',
    isGeolocated: false,
    hitsPerPage: 1,
  },
  color: Color.Aquamarine,
  videoTag: 'FAQ',
  offerTitle: 'Pour aller plus loin…',
}
