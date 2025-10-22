// This function converts the VAPID key to the correct format
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// This is the main function we'll call
export async function subscribeToPushNotifications() {
  const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!VAPID_PUBLIC_KEY) {
    console.error('VAPID public key not found in .env');
    return;
  }

  //  Register the service worker
  if ('serviceWorker' in navigator) {
    let registration;
    try {
      registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return;
    }

    //  Wait for the worker to be ready
    await navigator.serviceWorker.ready;
    console.log('Service Worker is ready');

    //  Ask for permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Push notification permission denied.');
      return;
    }
    console.log('Notification permission granted.');

    //  Get the push subscription
    let subscription;
    try {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      console.log('User is subscribed:', subscription);
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      return;
    }

    return subscription;
  } else {
    console.warn('Service workers are not supported in this browser.');
  }
}