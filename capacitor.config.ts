import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.remindvault.app',
  appName: 'Remind Vault',
  webDir: 'public',
  server: {
    url: 'https://remindevelop.vercel.app',
    cleartext: true
  }
};

export default config;
