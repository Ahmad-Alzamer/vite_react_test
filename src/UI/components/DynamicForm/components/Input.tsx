import {FieldDef} from "../types.ts";
import React from "react";
import {SelectInput} from "./inputs/SelectInput.tsx";
import {FileInput} from "./inputs/FileInput.tsx";
import {GenericInput} from "./inputs/GenericInput.tsx";

import {FileTableInput} from "./inputs/FileTableInput.tsx";

export function Input({
                          field,
                          index,
                          displayLabel = true,
                          overrideFieldName,
                          overrideErrorMessageName,
                          setUploadedDocumentIds
                      }: {
    field: FieldDef,
    index: number,
    displayLabel?: boolean,
    overrideFieldName?: string,
    overrideErrorMessageName?: string,
    setUploadedDocumentIds?: (input: { [fileName: string]: string }) => void
}): React.JSX.Element {
    if (field.type === 'select') {
        return <SelectInput field={field} index={index} key={field.name + "-" + index} displayLabel={displayLabel}
                            overrideFieldName={overrideFieldName} overrideErrorMessageName={overrideErrorMessageName}/>;
    } else if (field.type === 'file') {
        return <FileInput field={field} index={index} key={field.name + "-" + index} displayLabel={displayLabel}
                          overrideFieldName={overrideFieldName} overrideErrorMessageName={overrideErrorMessageName}
                          setUploadedDocumentIds={setUploadedDocumentIds}/>;
    } else if (field.type === 'file-table-inputs') {
        return <FileTableInput field={field} index={index} key={field.name + "-" + index} displayLabel={displayLabel}/>;
    } else {
        return <GenericInput field={field} index={index} key={field.name + "-" + index} displayLabel={displayLabel}
                             overrideFieldName={overrideFieldName}
                             overrideErrorMessageName={overrideErrorMessageName}/>;
    }
}