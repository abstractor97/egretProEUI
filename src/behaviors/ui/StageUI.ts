import { ResourceManager } from "@egret/core";
import { component } from "@egret/ecs";
import { Stage2D, Touchable2D, UIRoot } from "@egret/egret2d";
import { Application, Behaviour, EngineUtil, Screen } from "@egret/engine";
import { AssetAdapter } from "../../AssetAdapter";
import { ThemeAdapter } from "../../ThemeAdapter";
declare var resRootUrl;
declare var startGameRecorder;
@component()
export class StageUI extends Behaviour {

    stage2D: Stage2D;
    private _uiRoot: UIRoot;
    clickButton: eui.Button;

    public onAwake(): void {
        egret.ImageLoader.crossOrigin = "anonymous";
        const Res = ResourceManager.instance;
        Res.baseUrl = resRootUrl ? resRootUrl : "resource/";
        Res.loadConfig("default.res.json");
        const assetAdapter: AssetAdapter = new AssetAdapter();
        const themeAdapter: ThemeAdapter = new ThemeAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", themeAdapter);
        this.stage2D = this.entity.getComponent(Stage2D);
        this.stage2D.entity.addComponent(Touchable2D);
        let screen = Application.instance.screen;
        let screenWH = screen.size;
        let adapterWHS = { w: screenWH.w, h: screenWH.h, s: 1 };
        if (EngineUtil.isMobile) {
            adapterWHS = { w: 750, h: 1334, s: 0 }
        }
        let stage = Application.instance.stage;
        stage.size = { w: screenWH.w, h: screenWH.h }
        stage.matchFactor = adapterWHS.s;
        this.loadResource();
    }

    public onStart(): void {
        Application.instance.globalEntity.getOrAddComponent(Screen)!.useDevicePixelRatio = true;
    }
    private async loadResource() {
        await RES.loadConfig("2d/default.D2.res.json", resRootUrl ? resRootUrl : "resource/");
        await this.loadTheme();
        const uiRoot = this.stage2D.entity.addComponent(UIRoot);
        const uiLayer: eui.UILayer = new eui.UILayer();
        uiLayer.touchEnabled = false;
        uiRoot.addChild(uiLayer);

        const clickButton = new eui.Button();
        clickButton.label = "Click!";
        clickButton.horizontalCenter = 0;
        clickButton.verticalCenter = 0;
        clickButton.width = 150;
        clickButton.height = 75;

        uiLayer.addChild(clickButton);
        clickButton.addEventListener(egret.TouchEvent.TOUCH_TAP, onButtonClick, null);

        function onButtonClick(e: egret.TouchEvent): void {
            showPannel("Hello World!");
            // startGameRecorder();
        }
        async function showPannel(title: string) {
            const panel = new eui.Panel();
            panel.title = title;
            panel.horizontalCenter = 0;
            panel.verticalCenter = 0;
            uiLayer.addChild(panel);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("2d/default.thm.json", this.stage2D._egretStage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }
}