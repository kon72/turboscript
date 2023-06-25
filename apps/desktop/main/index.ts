import {join} from 'path';

import {BrowserWindow, IpcMainEvent, app, ipcMain} from 'electron';
import serveNextAt from 'next-electron-server';

import {bindings} from 'hello-world-node';

console.log();
console.log('bindings:');
console.log(bindings);
console.log(bindings.hello());
console.log();

const NEXT_BASE_URL = 'next://app';
serveNextAt(NEXT_BASE_URL, {
  outputDir: './out/renderer',
});

// Prepare the renderer once the app is ready
app.whenReady().then(async () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(NEXT_BASE_URL);
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});
