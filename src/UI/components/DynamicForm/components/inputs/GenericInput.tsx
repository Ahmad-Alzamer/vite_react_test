import {FieldDef} from "../../types.ts";
import React from "react";
import {useFormContext} from "react-hook-form";

export function GenericInput({field, index, overrideFieldName, overrideErrorMessageName, displayLabel = true}: {
    field: FieldDef,
    index: number,
    displayLabel: boolean,
    overrideFieldName?: string,
    overrideErrorMessageName?: string
}): React.JSX.Element {
    // const fieldController = useController({
    //     name:field.name,
    //     control,
    //     defaultValue: ''
    // });
    // console.info('inside generic element for field:',fieldController.field.name,' with value', fieldController.field.value)
    // return (
    //     <div className="field is-horizontal" >
    //         <div className="field-label is-normal">
    //             <label className="label" htmlFor={field.name+"-"+index}>{field.label}</label>
    //         </div>
    //         <div className="field-body">
    //             <div className="field">
    //                 <div className="control">
    //                     <inputs
    //                         onChange={fieldController.field.onChange}
    //                         onBlur={fieldController.field.onBlur}
    //                         value = {fieldController.field.value}
    //                         // defaultValue={''}
    //                         className={`inputs ${formState.errors[field.name]?'is-danger':''}`}
    //                         type={field.type}
    //                         id={field.name+"-"+index}
    //                         autoComplete={field.name}
    //                         name = {fieldController.field.name}
    //                         ref = {fieldController.field.ref}
    //                     />
    //                     {formState.errors[field.name] &&  [formState.errors[field.name]?.message].flat().map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
    const {formState, register} = useFormContext();
    return (
        <div className="field is-horizontal">
            {displayLabel && (
                <div className="field-label is-normal">
                    <label className="label is-capitalized" htmlFor={field.name}>{field.label}</label>
                </div>
            )}
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        <input {...register(overrideFieldName ?? field.name,)}
                               className={`input ${formState.errors[field.name] ? 'is-danger' : ''}`} type={field.type}
                               id={field.name + "-" + index} autoComplete={field.name}/>
                        {formState.errors[overrideErrorMessageName ?? field.name] && [formState.errors[overrideErrorMessageName ?? field.name]].flat().map(error => error?.message).map(message =>
                            <p className="help is-danger"
                               key={'error-message-' + field.name + "-" + message}>{message}</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}