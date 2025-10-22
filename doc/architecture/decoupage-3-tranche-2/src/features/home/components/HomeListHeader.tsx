/* eslint-disable */
// @ts-nocheck
// prettier-ignore
import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { Spacer, PageContent, VideoCarouselModule } from 'src/features/home/pages/GenericHome';
import { HomepageModule } from 'features/home/types';

type HomeListHeaderProps = {
  Header: React.JSX.Element;
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
    </View>
  );
};
