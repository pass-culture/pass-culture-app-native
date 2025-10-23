
// doc/strangler-fig-pattern-example/features/home/components/HomeListHeader.tsx

import React, { FunctionComponent } from 'react';
import { View, Text } from 'react-native';
import { Spacer, PageContent, VideoCarouselModule } from '../../../../ui-mocks'; // Import des mocks
import { HomepageModule } from '../types';

type HomeListHeaderProps = {
  Header?: React.JSX.Element;
  HomeBanner?: React.JSX.Element;
  shouldDisplayVideoInHeader: boolean;
  videoCarouselModules: HomepageModule[];
  homeId: string;
}

export const HomeListHeader: FunctionComponent<HomeListHeaderProps> = ({
  Header,
  HomeBanner,
  shouldDisplayVideoInHeader,
  videoCarouselModules,
  homeId,
}) => {
  return (
    <View testID="listHeader">
      {Header}
      <Spacer.Column numberOfSpaces={6} />
      {shouldDisplayVideoInHeader && videoCarouselModules[0] ? (
        <VideoCarouselModule
          index={0}
          homeEntryId={homeId}
          {...videoCarouselModules[0]}
          autoplay
        />
      ) : null}
      <PageContent>{HomeBanner}</PageContent>
      <Text style={{ fontSize: 12, color: '#666', padding: 5 }}>HomeListHeader (DR022)</Text>
    </View>
  );
};
