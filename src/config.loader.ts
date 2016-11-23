export abstract class ConfigLoader {
    abstract getApiEndpoint(): string;
}

export class ConfigHttpLoader implements ConfigLoader {
    constructor(private readonly apiEndpoint: any = '/config.json') {}

    getApiEndpoint(): string {
        return this.apiEndpoint.toString();
    }
}
