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
  offersModuleParameters: [
    {
      title: 'test music type',
      hitsPerPage: 1,
    },
    {
      title: 'test music type',
      hitsPerPage: 1,
    },
  ],
  color: Color.Aquamarine,
  videoTag: 'FAQ',
  offerTitle: 'Pour aller plus loin…',
  videoPublicationDate: '2023-06-16',
  videoDescription:
    'Lujipeka répond à vos questions sur sa tournée, sa musique, ses inspirations et pleins d’autres questions&nbsp;!',
  offerIds: ['12345', '67890'],
  transcription:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cursus augue nec ligula dapibus, in varius sapien fermentum. Aenean euismod enim ipsum, a lacinia nulla luctus sed. Ut eget pellentesque augue, sed blandit mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce iaculis nunc sapien, at viverra libero mattis non. Integer imperdiet interdum cursus. Donec convallis sodales purus, sed dapibus mi. Nulla efficitur orci quis ante auctor, a semper odio rhoncus. Nulla mollis aliquet sapien at fermentum. Vivamus pharetra dui odio, ut euismod neque laoreet a.',
}
