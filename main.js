const path = require('path');
const url = require('url');
const { app, BrowserWindow, Menu, shell} = require('electron');

let mainWindow
let isDev = false

if (
	process.env.NODE_ENV !== undefined &&
	process.env.NODE_ENV === 'development'
) {
	isDev = true
}

let database_path = '';
if(isDev){
    database_path = path.join(process.cwd(), '/assets/');
}else{
    database_path = path.join(process.cwd(), '/resources/app/assets/');
}

function createMainWindow() {
	//in the main window's menu bar, add a new menu item in Edit
	//add submenu name of Structure

	const menu_template = [
		{
			label: 'File',
			submenu: [
				{
					label: 'Open Structure',
					click: () => {
						const str_path = path.join(
							database_path,
							'database/structure'
						);
						shell.openPath(str_path);
					}
				},
				{
					label: 'Exit',
					click: () => { app.quit() }
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					click: () => { mainWindow.reload() }
				},
				{
					label: 'Toggle Developer Tools',
					click: () => { mainWindow.webContents.toggleDevTools() }
				}
			]
		}
	];

	//create mainWindow with 1100x800, show:false, and set the menu

	mainWindow = new BrowserWindow({
		width: 1100,
		height: 800,
		show: false,
		icon: path.join(__dirname, 'assets/icon.png'),
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false
		},
		shortcut: {
			'reload': 'Ctrl+R'
		},
		menu: Menu.setApplicationMenu(
			Menu.buildFromTemplate(menu_template)
		),
	});

	let indexPath;

	if (isDev && process.argv.indexOf('--noDevServer') === -1) {
		indexPath = url.format({
			protocol: 'http:',
			host: 'localhost:8080',
			pathname: 'index.html',
			slashes: true,
		})
	} else {
		indexPath = url.format({
			protocol: 'file:',
			pathname: path.join(__dirname, 'dist', 'index.html'),
			slashes: true,
		})
	}

	mainWindow.loadURL(indexPath)

	// Don't show until we are ready and loaded
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()

		// Open devtools if dev
		if (isDev) {
			const {
				default: installExtension,
				REACT_DEVELOPER_TOOLS,
			} = require('electron-devtools-installer')

			installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
				console.log('Error loading React DevTools: ', err)
			)
			mainWindow.webContents.openDevTools()
		}
	})

	mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createMainWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow()
	}
})

// Stop error
app.allowRendererProcessReuse = true
