import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.remindvault.app',
  appName: 'Remind Vault',
  webDir: 'public',
  server: {
    url: 'https://YOUR_VERCEL_PROJECT_URL.vercel.app', // Update this after deployment
    cleartext: true
  }
};

export default config;
