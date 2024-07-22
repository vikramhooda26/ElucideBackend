class TokenManager {
    private static instance: TokenManager;
    private tokenStore: Map<string, string>;

    private constructor() {
        this.tokenStore = new Map<string, string>();
    }

    static getInstance() {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }

    setToken(userId: string, accessToken: string) {
        this.tokenStore.set(userId, accessToken);
    }

    getToken(userId: string): string | undefined {
        return this.tokenStore.get(userId);
    }

    removeToken(userId: string) {
        this.tokenStore.delete(userId);
    }

    hasToken(userId: string): boolean {
        return this.tokenStore.has(userId);
    }
}

export const tokenManager = TokenManager.getInstance();
