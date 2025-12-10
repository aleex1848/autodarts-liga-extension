export interface IConfig {
  enabled: boolean;
  token: string;
  eachDart: boolean;
  allGameData: boolean;
  localDebug: boolean;
}

export const defaultConfig: IConfig = {
  enabled: false,
  token: "",
  eachDart: false,
  allGameData: false,
  localDebug: false,
};

export const AutodartsLigaConfig: WxtStorageItem<IConfig, any> = storage.defineItem(
  "local:config",
  {
    defaultValue: defaultConfig,
  },
);

