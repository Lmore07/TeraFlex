import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teraflex.app',
  appName: 'TeraFlex',
  android: {
    buildOptions: {
      keystoreAlias: 'Uteq_2025',
      keystorePath: 'Z:/Universidad/TeraFlex/teraflex_key.jks',
      keystorePassword: 'Uteq_2025_12345',
      keystoreAliasPassword: 'Uteq_2025_12345',
    },
  },
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
