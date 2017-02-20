// angular
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// libs
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

// module
import { ConfigLoader } from './config.loader';

@Injectable()
export class ConfigService {
    private readonly settings: any;

    constructor(private readonly http: Http,
                public loader: ConfigLoader) {
        this.settings = loader.getSettings();
    }

    getSettings(group?: string, key?: string): any {
        if (!group)
            return this.settings;

        if (!this.settings[group])
            throw new Error(`No setting found with the specified group [${group}]!`);

        if (!key)
            return this.settings[group];

        if (!this.settings[group][key])
            throw new Error(`No setting found with the specified group/key [${group}/${key}]!`);

        return this.settings[group][key];
    }
}
