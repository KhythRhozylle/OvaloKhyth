import React from 'react';
import { View, ViewStyle } from 'react-native';

import AppNav from './src/navigations';

const App: React.FC = () => {
  return (
    <View style={{ flex: 1 } as ViewStyle}>
      <AppNav />
    </View>
  );
};

export default App;
