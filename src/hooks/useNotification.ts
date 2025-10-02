import { useEffect } from 'react';
import notifee, {
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

export const useNotification = (hour = 9, minute = 0) => {
  useEffect(() => {
    const scheduleDailyNotification = async () => {
      await notifee.requestPermission();

      await notifee.cancelAllNotifications();

      const now = new Date();
      const nextTrigger = new Date();

      nextTrigger.setHours(hour);
      nextTrigger.setMinutes(minute);
      nextTrigger.setSeconds(0);

      if (nextTrigger <= now) {
        nextTrigger.setDate(nextTrigger.getDate() + 1);
      }

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: nextTrigger.getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
      };

      await notifee.createTriggerNotification(
        {
          title: 'Time to education!',
          body: 'Practice english today',
          android: {
            channelId: 'daily-reminder', 
            smallIcon: 'tray_icon',
          },
        },
        trigger,
      );
    };

    const createChannel = async () => {
      await notifee.createChannel({
        id: 'daily-reminder',
        name: 'Daily Reminder',
        importance: 4,
      });
    };

    createChannel().then(scheduleDailyNotification);
  }, [hour, minute]);
};
