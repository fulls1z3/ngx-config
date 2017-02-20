// angular
import { Http } from '@angular/http';

// libs
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export abstract class ConfigLoader {
    abstract init(): any;
    abstract getSettings(): any;
}

export class ConfigStaticLoader implements ConfigLoader {
    constructor(private readonly settings?: any) {}

    init(): any {
        return Promise.resolve(undefined);
    }

    getSettings(): any {
        return this.settings;
    }
}

export class ConfigHttpLoader implements ConfigLoader {
    private settingRepository: any;

    constructor(private readonly http: Http,
                private readonly path: string = '/config.json') {}

    init(): any {
        return this.http.get(this.path)
            .map((res: any) => res.json())
            .toPromise()
            .then((settings: any) => this.settingRepository = settings)
            .catch(() => Promise.reject('Endpoint unreachable!'));
    }

    getSettings(): any {
        return this.settingRepository;
    }
}
