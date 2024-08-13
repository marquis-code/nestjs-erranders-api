import { Cache } from 'cache-manager';
export declare class CacheService {
    private readonly cacheManager;
    constructor(cacheManager: Cache);
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
}
