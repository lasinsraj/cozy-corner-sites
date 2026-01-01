import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4a3b0c75dd4e48fda285b4786b4ce999',
  appName: 'A Lovable project',
  webDir: 'dist',
  server: {
    url: 'https://4a3b0c75-dd4e-48fd-a285-b4786b4ce999.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
