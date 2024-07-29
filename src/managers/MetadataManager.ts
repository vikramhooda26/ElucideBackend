class MetadataStore {
    private static instance: MetadataStore;
    private lastUpdated: Date;

    private constructor() {
        this.lastUpdated = new Date();
    }

    static getInstance(): MetadataStore {
        if (!MetadataStore.instance) {
            MetadataStore.instance = new MetadataStore();
        }

        return MetadataStore.instance;
    }

    getLastUpdated(): Date {
        return this.lastUpdated;
    }

    setLastUpdated(date: Date) {
        this.lastUpdated = date;
    }
}

export const metadataStore = MetadataStore.getInstance();
