import * as WorkboxWindow from 'workbox-window';

export function swRegister() {
  if (!('serviceWorker' in navigator)) {
    // eslint-disable-next-line no-alert
    alert('Service Worker not supported in the browser');
    return;
  }

  const wb = new WorkboxWindow.Workbox('./sw.bundle.js');

  wb.register();
}
