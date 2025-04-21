import { METADATA_KEYS } from "../lib/constants.js";

class MetadataStore {
  private static instance: MetadataStore;
  private hasUpdated: Record<string, boolean>;

  private constructor() {
    this.hasUpdated = Object.values(METADATA_KEYS).reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  }

  static getInstance(): MetadataStore {
    if (!MetadataStore.instance) {
      MetadataStore.instance = new MetadataStore();
    }

    return MetadataStore.instance;
  }

  getHasUpdated(metadataType: string): boolean {
    return this.hasUpdated[metadataType];
  }

  setHasUpdated(metadataType: string, hasUpdated: boolean) {
    this.hasUpdated[metadataType] = hasUpdated;
  }

  getAllRecords(): Record<string, boolean | undefined> {
    return this.hasUpdated;
  }
}

export const metadataStore = MetadataStore.getInstance();
