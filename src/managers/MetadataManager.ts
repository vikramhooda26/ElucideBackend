class MetadataStore {
    private static instance: MetadataStore;
    private lastUpdated: Record<string, Date>;

    private constructor() {
        this.lastUpdated = {};
    }

    static getInstance(): MetadataStore {
        if (!MetadataStore.instance) {
            MetadataStore.instance = new MetadataStore();
        }

        return MetadataStore.instance;
    }

    getLastUpdated(metadataType: string): Date {
        return this.lastUpdated[metadataType];
    }

    setLastUpdated(metadataType: string, date: Date) {
        this.lastUpdated[metadataType] = date;
    }

    getAllLastUpdated(): Record<string, Date | undefined> {
        return this.lastUpdated;
    }
}

export const metadataStore = MetadataStore.getInstance();
