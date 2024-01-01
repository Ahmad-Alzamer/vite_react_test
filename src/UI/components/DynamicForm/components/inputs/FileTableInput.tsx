import {FieldDef} from "../../types.ts";
import React, {useEffect} from "react";
import {useFieldArray, useFormContext} from "react-hook-form";
import {Input} from "../Input.tsx";

export function FileTableInput({field,}: { field: FieldDef, index: number, displayLabel: boolean }): React.JSX.Element {
    const tableInput = field.fileTableInput;


    const {watch, getValues} = useFormContext();
    const {fields, replace} = useFieldArray({
        name: field.name,

    });
    const files = watch(field.sourceFilesInputName ?? '') as FileList;

    useEffect(() => {
        const previousValue = getValues('accountDocumentsTypes');
        // console.info('inside file table inputs', previousValue)
        if (!previousValue || (previousValue as Array<any>).length === 0) {
            replace(Array.from(files).map(file => ({file: file})));
        }

        // replace(new Array(files.length).fill({test:23}));

    }, [files]);
    return (
        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
            <thead>
            <tr>
                <th>Document Name</th>
                {tableInput && <th>{tableInput?.label ?? field.label}</th>}


            </tr>
            </thead>
            <tfoot>

            </tfoot>
            <tbody>
            {fields.map((_field, index) => (
                <tr key={_field.id}>
                    <td>{files.item(index)?.name ?? ''}</td>
                    {tableInput && <td><Input field={tableInput} index={index} displayLabel={false}
                                              overrideFieldName={`${field.name}.${index}.${tableInput.name ?? ''}`}
                                              overrideErrorMessageName={`${field.name}[${index}].${tableInput?.name ?? ''}`}/>
                    </td>}
                </tr>
            ))}


            </tbody>
        </table>
    );
}