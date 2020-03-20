import './weapp-adapter';
window.resRootUrl = "http://10.0.14.249:3002/resource/"
window.DEG_TO_RAD = Math.PI / 180;
// 启动本地缓存，如果开发者不需要此功能，只需注释即可
// 只有使用 assetsmanager 的项目可以使用
// if (window.RES && RES.processor) {
// 	require('./library/file-util.js');
// 	require('./library/image.js');
// 	require('./library/text.js');
// 	require('./library/sound.js');
// 	require('./library/binary.js');
// }



window.startGameRecorder = function () {

	const recorder = wx.getGameRecorder();
	console.log("进入录屏 isSupport=>", recorder.isFrameSupported())
	if (!recorder.isFrameSupported()) {//不支持录屏
		return
	}
	recorder.on('timeUpdate', res => {
		console.log(res.currentTime)
	})
	recorder.on("start", res => {
		console.log("录屏开始......", res)
	})
	recorder.on("stop", res => {
		console.log("录屏结束......", res)
	})
	recorder.on("error", res => {
		console.log("录屏过程中异常......", res)
	})
	// try {
	recorder.start({ fps: 24, duration: 30, bitrate: 1000, gop: 12, hookBgm: false });
	// } catch (error) {
	// 	console.log("录屏异常...", error)
	// }

	console.log("录屏.....recorder.start")
}


require('./dist/libs/egret.js');
require('./dist/libs/eui.js');
require('./dist/libs/egret.wxgame.js');
require('./dist/libs/assetsmanager.js');
require('./dist/libs/game.js');
require('./dist/libs/tween.js');
require('./dist/libs/default.thm.js');
require('./dist/client.bundle.js');


function startTicker(ticker) {
	var requestAnimationFrame = window["requestAnimationFrame"] ||
		window["webkitRequestAnimationFrame"] ||
		window["mozRequestAnimationFrame"] ||
		window["oRequestAnimationFrame"] ||
		window["msRequestAnimationFrame"];
	if (!requestAnimationFrame) {
		requestAnimationFrame = function (callback) {
			return window.setTimeout(callback, 1000 / 60);
		};
	}
	requestAnimationFrame(onTick);
	function onTick() {
		requestAnimationFrame(onTick);
		ticker.update(true);
	}
}

startTicker(egret.ticker);
egret.wxgame.Html5Capatibility.$init();
wx.getSystemInfo({
	success(res) {
		var infoStr = "";
		for (let k in res) {
			infoStr += k + ":" + res[k] + ",";
		}
		console.log(infoStr)
	}
})
wx.onMemoryWarning(function () {
	wx.triggerGC();
})
wx.setPreferredFramesPerSecond(60)
loadScene();
function loadScene() {
	window.setTimeout(() => {

		if (Application.instance && Application.instance.sceneManager) {
			Application.instance.sceneManager.loadScene("assets/scenes/ui/egretUI.scene.json").then(() => {
				console.log("加载场景assets/scenes/ui/egretUI.scene.json success")
				// startGameRecorder();
			});
		} else {
			loadScene();
		}
	}, 1000)
}