import { ViewEngineHooks, View, viewEngineHooks } from 'aurelia-framework';

export enum StorageModalMode {

    CREATE = 1,
    EDIT,
    VIEW
}

// See this link for a useful example: http://www.foursails.co/blog/template-constants/
@viewEngineHooks()
export class StorageModalModeBinder implements ViewEngineHooks {
    beforeBind(view: View) {

        // Make the enumerated type available
        view.overrideContext['StorageModalMode'] = StorageModalMode;

        // TypeScript enums are not iterable by default; thus, make it iterable (may be useful)
        view.overrideContext['StorageModalModes'] =
            Object.keys(StorageModalMode)
            .filter((key) => typeof StorageModalMode[key] === 'number');
    }
}