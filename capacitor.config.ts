import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.johnboniello.grocerylist',
  appName: 'Grocery List',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
