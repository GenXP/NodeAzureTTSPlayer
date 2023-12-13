import { existsSync, readFileSync } from "fs";
import path from 'path';

export class Configuration {
  data = {}

  Get(key) {
    return this.data[key];
  }

  get Log() {
    const levels = "none, error, info, debug";
    return levels.indexOf(this.data["logLevel"]);
  }

  get Word() {
    let _words = this.Get("words").split(" ")
    return _words[Math.floor(Math.random() * _words.length - 1)]
  }

  constructor() {
    //FIXME
    //let defaultConfig = this.loadFile("./Config/default.json"); 
    //let localConfig = this.loadFile("./Config/local.json");
    //this.data = this.loadFile("./Config/production.json");
    this.data = path.resolve(new URL('Config/production.json', import.meta.url).pathname);
    
    //this.data = Object.assign(defaultConfig, localConfig, productionConfig);
    if (this.Log > 2) {
      console.log(this.data);
    }
  }

    loadFile(filepath) {
        if (existsSync(filepath)) {
            let _data = readFileSync(filepath);
            try {
                return JSON.parse(_data);
            } catch (e) { }
        }
    }
}
