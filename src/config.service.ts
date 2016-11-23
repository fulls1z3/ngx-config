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
    private settingsRepository: any = undefined;

    constructor(private readonly http: Http,
                public loader: ConfigLoader) {}

    init(): any {
        return this.http.get(this.loader.getApiEndpoint())
            .map((res: any) => res.json())
            .toPromise()
            .then((settings: any) => this.settingsRepository = settings)
            .catch(() => {
                throw new Error('Error: apiEndpoint unreachable!');
            });
    }

    getSettings(group?: string, key?: string): any {
        if (!group)
            return this.settingsRepository;

        if (!this.settingsRepository[group])
            throw new Error(`Error: No setting found with the specified group [${group}]!`);

        if (!key)
            return this.settingsRepository[group];

        if (!this.settingsRepository[group][key])
            throw new Error(`Error: No setting found with the specified group/key [${group}/${key}]!`);

        return this.settingsRepository[group][key];
    }
}
