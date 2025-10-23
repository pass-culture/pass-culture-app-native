
// doc/strangler-fig-pattern-example/ui-mocks.ts

import React from 'react';
import { View, Text } from 'react-native';

// Mocks simplifiés pour l'exemple
export const Spacer = { Column: ({ numberOfSpaces }: { numberOfSpaces: number }) => <View style={{ height: numberOfSpaces * 4 }} /> };
export const PageContent = ({ children }: { children: React.ReactNode }) => <View>{children}</View>;
export const VideoCarouselModule = ({ title }: { title: string }) => <Text>Video Carousel: {title}</Text>;
