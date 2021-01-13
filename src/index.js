const { BrowserWindow, Menu, Tray, app } = require("electron");

const icon_path = __dirname + '/assets/icon.ico';

let tray = null;
let WindowSettings;

function Client() {
  WindowSettings = new BrowserWindow({
    width: 1200, height: 780,
    minHeight: 560, minWidth: 650,
    center: true,
    resizable: true,
    title: 'Giggl',
    icon: icon_path,
    webPreferences: {
      devTools: true
    }
  });


  WindowSettings.loadURL("https://canary.giggl.app");

  WindowSettings.setMenu(null)

  WindowSettings.on('close', (event) => {
    if (app.quitting) {
      WindowSettings = null
    } else {
      event.preventDefault()
      WindowSettings.hide()
    }
  })

}


app.on("ready", () => {
  Client();
  buildTray();
});

const sameInstance = app.requestSingleInstanceLock()

if (!sameInstance) {
  app.quit()
  WindowSettings.show()
} else {
  app.on('second-instance', () => {
    if (WindowSettings) {
      if (WindowSettings.isMinimized()) WindowSettings.restore()
      WindowSettings.focus()
    }
  })
}

function buildTray() {
  tray = new Tray(icon_path)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit Giggl',
      click: function () {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Giggl')
  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    WindowSettings.show();
  });
}

app.on('window-all-closed', function (event) {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  app.on('activate', () => { WindowSettings.show() })
})

app.on('before-quit', () => app.quitting = true)