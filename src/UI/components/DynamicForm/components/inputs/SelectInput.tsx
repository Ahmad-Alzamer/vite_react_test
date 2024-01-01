import {FieldDef} from "../../types.ts";
import React from "react";
import {useFormContext} from "react-hook-form";

export function SelectInput({field, index, overrideFieldName, overrideErrorMessageName, displayLabel = true}: {
    field: FieldDef,
    index: number,
    displayLabel: boolean,
    overrideFieldName?: string,
    overrideErrorMessageName?: string
}): React.JSX.Element {
    // const placeholder='placeholder';
    // const fieldController = useController({
    //     name:field.name,
    //     control,
    //     defaultValue: placeholder
    // });
    //
    // console.info('inside select element for field:',fieldController.field.name,' with value', fieldController.field.value)
    // return (
    //     <div className="field is-horizontal">
    //         <div className="field-label is-normal">
    //             <label className="label" htmlFor={field.name+"-"+index}>{field.label}</label>
    //         </div>
    //         <div className="field-body">
    //             <div className="field">
    //                 <div className="control">
    //                     <div  className={`select is-fullwidth ${formState.errors[field.name]?'is-danger':''}`}>
    //                         <select id={field.name+"-"+index}
    //                                 name={fieldController.field.name}
    //                                 // defaultValue={placeholder}
    //                                 onBlur={fieldController.field.onBlur}
    //                                 onChange={fieldController.field.onChange}
    //                                 // value = {fieldController.field.value}
    //                                 ref = {fieldController.field.ref}
    //
    //                         >
    //                             <option disabled value={placeholder}>Please Select Gender</option>
    //                             {field.selectOptions?.map(option => <option value={option.code} key={option.code}>{option.text}</option>)}
    //                         </select>
    //                     </div>
    //                     {formState.errors[field.name] &&  [formState.errors[field.name]?.message].flat().map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )
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
                        <div className={`select is-fullwidth ${formState.errors[field.name] ? 'is-danger' : ''}`}>
                            <select {...register(overrideFieldName ?? field.name)} id={field.name + index}
                                    defaultValue='placeholder' className='is-capitalized'>
                                <option disabled
                                        value='placeholder'>{field.placeHolder ?? 'Please Select Value'}</option>
                                {field.selectOptions?.map(option => <option value={option.code}
                                                                            key={option.code}>{option.text}</option>)}
                            </select>
                        </div>
                        {formState.errors[overrideErrorMessageName ?? field.name] && [formState.errors[overrideErrorMessageName ?? field.name]].flat().map(error => error?.message).map(message =>
                            <p className="help is-danger"
                               key={'error-message-' + field.name + "-" + message}>{message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}