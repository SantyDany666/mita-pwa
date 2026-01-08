import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mita.pwa',
  appName: 'mita-pwa',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
