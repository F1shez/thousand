import { useEffect } from 'react';
import notifee, {
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

export const useNotification = (hour = 9, minute = 0) => {
  useEffect(() => {
    const scheduleDailyNotification = async () => {
      // Запрос разрешения
      await notifee.requestPermission();

      // Удаляем старые уведомления
      await notifee.cancelAllNotifications();

        // Время следующего уведомления
        const now = new Date();
        const nextTrigger = new Date();
        nextTrigger.setHours(hour);
        nextTrigger.setMinutes(minute);
        nextTrigger.setSeconds(0);

        // Если время уже прошло сегодня, ставим на завтра
        if (nextTrigger <= now) {
          nextTrigger.setDate(nextTrigger.getDate() + 1);
        }

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: nextTrigger.getTime(),
        repeatFrequency: RepeatFrequency.DAILY, // повторение каждый день
      };

      await notifee.createTriggerNotification(
        {
          title: 'Time to education!',
          body: 'practice english today',
          android: {
            channelId: 'daily-reminder', // канал нужно создать
            smallIcon: 'ic_launcher', // ваш иконка
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
