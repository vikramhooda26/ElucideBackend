class TokenManager {
    private static instance: TokenManager;
    private tokenStore: Map<number, string>;

    private constructor() {
        this.tokenStore = new Map<number, string>();
    }

    static getInstance() {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }

    setToken(userId: number, accessToken: string) {
        this.tokenStore.set(userId, accessToken);
    }

    getToken(userId: number): string | undefined {
        return this.tokenStore.get(userId);
    }

    removeToken(userId: number) {
        this.tokenStore.delete(userId);
    }

    hasToken(userId: number): boolean {
        return this.tokenStore.has(userId);
    }
}

export const tokenManager = TokenManager.getInstance();
