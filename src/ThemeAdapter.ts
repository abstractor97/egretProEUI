
import { ResourceManager, ResourceType } from "@egret/core";

declare var generateEUI: any;

export class ThemeAdapter implements eui.IThemeAdapter {
  public getTheme(url: string, onSuccess: Function, onError: Function, thisObject: any): void {
    const Res = ResourceManager.instance;
    if (typeof generateEUI !== 'undefined') {
      // console.log(url, 'loadstart')
      setTimeout(() => {
        onSuccess.call(thisObject, generateEUI);
      }, 100)
    }
    else {
      Res.load({ uri: url, type: ResourceType.Text })
        .then((data: any) => {
          onSuccess.call(thisObject, data.data);
        })

    }
  }
}