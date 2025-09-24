import { JSX } from 'react';
import { BaseToast, BaseToastProps } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      text1Style={{ fontSize: 24, fontWeight: '600' }}
      text2Style={{ fontSize: 20 }}
      text2NumberOfLines={0} // теперь переносится
      style={{ minHeight: 70, height: 'auto', paddingVertical: 10 }}
      contentContainerStyle={{ flexWrap: "wrap" }}
    />
  ),
};
