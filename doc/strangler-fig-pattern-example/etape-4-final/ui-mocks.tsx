
// doc/strangler-fig-pattern-example/ui-mocks.ts

import React from 'react';
import { View, Text } from 'react-native';

// Mocks simplifiés pour l'exemple
export const PageContent = ({ children }: { children: React.ReactNode }) => <View>{children}</View>;
export const VideoCarouselModule = ({ title }: { title: string }) => <Text>Video Carousel: {title}</Text>;
