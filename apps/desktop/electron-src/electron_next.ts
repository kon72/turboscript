import * as http from 'http';
import * as path from 'path';

import {resolve} from 'app-root-path';
import {app, protocol} from 'electron';
import isDev from 'electron-is-dev';

const devServer = async (dir, port) => {
  // We need to load it here because the app's production
  // bundle shouldn't include it, which would result
  // in an error
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const next = require('next')({dev: true, dir});
  const requestHandler = next.getRequestHandler();

  // Build the renderer code and watch the files
  await next.prepare();

  // But if developing the application, create a
  // new native HTTP server (which supports hot code reloading)
  const server = http.createServer(requestHandler);

  server.listen(port || 8000, () => {
    // Make sure to stop the server when the app closes
    // Otherwise it keeps running on its own
    app.on('before-quit', () => server.close());
  });
};

const adjustRenderer = directory => {
  const prefixes = ['/_next', '/static'];
  const isWindows = process.platform === 'win32';

  protocol.interceptFileProtocol('file', (request, callback) => {
    let requestPath = request.url.substr(isWindows ? 8 : 7);

    for (const prefix of prefixes) {
      let newPath = requestPath;

      // On windows the request looks like: file:///C:/static/bar
      // On other systems it's file:///static/bar
      if (isWindows) {
        newPath = newPath.substr(2);
      }

      if (!newPath.startsWith(prefix)) {
        continue;
      }

      // Strip volume name from path on Windows
      if (isWindows) {
        newPath = requestPath.normalize(newPath);
      }

      newPath = path.join(directory, 'out', newPath);
      requestPath = newPath;
    }

    // Electron doesn't like anything in the path to be encoded,
    // so we need to undo that. This specifically allows for
    // Electron apps with spaces in their app names.
    requestPath = decodeURIComponent(requestPath);

    callback({path: requestPath});
  });
};

export interface Directories {
  production: string;
  development: string;
}

export async function prepareNext(directories: Directories, port?: number);
export async function prepareNext(directories: string, port?: number);
export async function prepareNext(
  directories: Directories | string,
  port?: number
) {
  if (typeof directories === 'string') {
    directories = {
      production: directories,
      development: directories,
    };
  }

  for (const directory in directories) {
    if (!path.isAbsolute(directories[directory])) {
      directories[directory] = resolve(directories[directory]);
    }
  }

  if (isDev) {
    await devServer(directories.development, port);
  } else {
    adjustRenderer(directories.production);
  }
}
