import { ViewEngineHooks, View, viewEngineHooks } from 'aurelia-framework';

export enum StorageType {

    MATERIAL = 1,
    CONTAINER,
    USER,
    ORDER,
    CONTENTS,
    ASSIGN_ALIQUOT,
    ASSIGN_CONTAINER
}

// See this link for a useful example: http://www.foursails.co/blog/template-constants/
@viewEngineHooks()
export class StorageTypeBinder implements ViewEngineHooks {
    beforeBind(view: View) {

        // Make the enumerated type available
        view.overrideContext['StorageType'] = StorageType;

        // TypeScript enums are not iterable by default; thus, make it iterable (may be useful)
        view.overrideContext['StorageTypes'] =
            Object.keys(StorageType)
            .filter((key) => typeof StorageType[key] === 'number');
    }
}