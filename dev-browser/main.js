const { app, BrowserWindow } = require("electron");

const path = require("path");

console.log("__dirname", __dirname);
const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 700,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	win.loadFile("index.html");
};

app.whenReady().then(() => {
	createWindow();
});

try {
	require("electron-reloader")(module);
} catch (_) {}
