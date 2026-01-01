import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePushNotifications = () => {
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const isPushSupported = Capacitor.isNativePlatform();
    setIsSupported(isPushSupported);
    
    if (!isPushSupported) {
      console.log('Push notifications not supported on web');
      return;
    }

    registerPushNotifications();
  }, []);

  const registerPushNotifications = async () => {
    try {
      // Request permission
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.log('Push notification permission not granted');
        toast({
          title: 'Notifications disabled',
          description: 'Enable notifications in settings to receive booking alerts',
          variant: 'destructive'
        });
        return;
      }

      // Register with FCM/APNs
      await PushNotifications.register();

      // Handle registration success
      PushNotifications.addListener('registration', async (token: Token) => {
        console.log('Push registration success, token:', token.value);
        setToken(token.value);
        
        // Store token in database for sending notifications
        await saveDeviceToken(token.value);
        
        toast({
          title: 'Notifications enabled',
          description: 'You will receive alerts for new bookings'
        });
      });

      // Handle registration error
      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Push registration error:', error);
        toast({
          title: 'Notification setup failed',
          description: 'Could not enable push notifications',
          variant: 'destructive'
        });
      });

      // Handle incoming push while app is open
      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        console.log('Push notification received:', notification);
        toast({
          title: notification.title || 'New Booking',
          description: notification.body || 'You have a new booking request'
        });
      });

      // Handle notification tap
      PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
        console.log('Push notification action performed:', notification);
        // Navigate to admin page or booking details
        window.location.href = '/admin';
      });

    } catch (error) {
      console.error('Error setting up push notifications:', error);
    }
  };

  const saveDeviceToken = async (deviceToken: string) => {
    try {
      // Call edge function to save token
      const { error } = await supabase.functions.invoke('save-device-token', {
        body: { token: deviceToken, device_type: Capacitor.getPlatform() }
      });
      
      if (error) {
        console.error('Error saving device token:', error);
      }
    } catch (error) {
      console.error('Error saving device token:', error);
    }
  };

  return { token, isSupported };
};
