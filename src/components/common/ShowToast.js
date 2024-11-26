import {ToastAndroid} from 'react-native';

export const showToast = message => {
  if (message.startsWith('<!DOCTYPE')) {
    return;
  }
  if (message.startsWith('Un authorized, read action is forbidden')) {
    return;
  }

  if (message.startsWith('Table Management is not available for this Vendor')) {
    return;
  }
  
  ToastAndroid.show(message, ToastAndroid.SHORT);
};
