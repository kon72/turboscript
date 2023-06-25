import {join} from 'path';
import {format} from 'url';

import {BrowserWindow, IpcMainEvent, app, ipcMain} from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';

import {bindings} from 'hello-world-node';

console.log();
console.log('bindings:');
console.log(bindings);
console.log(bindings.hello());
console.log();

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./apps/desktop/renderer');

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  });

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});
