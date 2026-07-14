import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'skilldeck',
  webDir: 'dist',
  server: {
    url: 'https://skill-deck-eight.vercel.app',
    cleartext: true
  }
};

export default config;
