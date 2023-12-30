import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from "yup";
import {useYupValidationResolver} from "../../../hooks/useYupValidationResolver.ts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faUpload } from '@fortawesome/free-solid-svg-icons'
import {FormState, UseFormGetValues, UseFormRegister} from "react-hook-form/dist/types/form";

type FormValidations = 'REQUIRED' | 'MIN' | 'MAX' | 'PATTERN' | 'FILE-TYPE' | 'PATTERN';
interface FieldDef{
    name: string,
    label: string,
    type : 'text' | 'select' | 'file',
    selectOptions? : Array<{code: string, text: string}>,
    validations: Array<{type: FormValidations, message?: string, supportedFileTypes: Set<string>, min?: number, max?: number, pattern?: RegExp}>
}
const formDef={
    fields:[
        {
            name:'firstName',
            label: 'First Name',
            type: 'text',
            validations:[
                {
                    type: 'REQUIRED'
                }
            ]

        },
        {
            name:'lastName',
            label: 'Last Name',
            type: 'text',
            validations:[
                {
                    type: 'REQUIRED'
                }
            ]

        },
        {
            name:'gender',
            label: 'Gender',
            type: 'select',
            selectOptions:[
                {
                    code:'male',
                    text:'Male'
                },
                {
                    code:'female',
                    text:'Female'
                }
            ],
            validations:[
                {
                    type: 'REQUIRED'
                }
            ]

        },
        {
            name:'profilePicture',
            label: 'Profile Picture',
            type: 'file',
            validations:[
                {
                    type: 'REQUIRED',
                    message: 'please select a file'
                },
                {
                    type: 'MIN',
                    min:1,
                    message: 'please provide at least one ${VALIDATION-MIN-VALUE}'
                },
                {
                    type: 'MAX',
                    max:1,
                    message: 'too many files selected'
                },
                {
                    type: 'FILE-TYPE',
                    supportedFileTypes:new Set(['application/pdf']),
                    message: 'file type selected is not supported'
                }
            ]

        },
        {
            name:'userName',
            label: 'User Name',
            type: 'text',
            validations:[
                {
                    type: 'REQUIRED'
                },
                {
                    type: 'MAX',
                    max: 20
                },
                {
                    type: 'MIN',
                    min:3
                }
            ]
        },
        {
            name:'password',
            label: 'Password',
            type: 'text',
            validations:[
                {
                    type: 'MAX',
                    max: 20
                },
                {
                    type: 'MIN',
                    min:3
                },
                {
                    type: 'PATTERN',
                    pattern: /[A-Z]+/,
                    message:'${path} must have at least one capital letter'
                },
                {
                    type: 'PATTERN',
                    pattern: /[0-9]+/,
                    message:'${path} must have at least one number'
                },
                {
                    type: 'PATTERN',
                    pattern: /[!@#$%^&*]+/,
                    message:'${path} must have at least one of the following special character:  !@#$%^&*'
                }
            ]
        },
    ] as Array<FieldDef>
}

export function NewUser(){
    const yupObject = formDef.fields.map(field => {
        let value = (field.type==='file'? yup.mixed() : yup.string()).label(field.label);
        value = field.validations.reduce((prev, curr)=>{
            if(field.type === 'file'){
                switch (curr.type){
                    case "REQUIRED": return prev.test('required',curr.message ??'please select a file', (value:any) =>  value && (value as FileList).length>0);
                    // case "MIN": return prev.test('fewFiles',curr.message?.replace('${VALIDATION-MIN-VALUE}',(curr.min??Number.MIN_VALUE)+"") ??'number of selected file is less than the required number', (value:any) =>  { console.info('file min',field.name,(value as FileList),(value as FileList).length); return value && (value as FileList).length>=(curr.min??Number.MIN_VALUE);});
                    case "MAX": return prev.test('tooManyFiles',curr.message??'too many files selected', (value:any) =>  {
                        return value && (value as FileList).length<=(curr.max??Number.MAX_VALUE);});
                    case "FILE-TYPE": return prev.test('fileType',curr.message??'the file type is not supported', (value?:any) => {console.info('file type',field.name,(value as FileList),(value as FileList).length);  return  (value as FileList)?.length<1 || Array.from(value as FileList).every(file => curr.supportedFileTypes.has(file.type) );});
                    default: {
                        console.warn('provided validation type is not supported for File input', curr.type)
                        return prev;
                    }
                }
            }else{
                switch (curr.type){
                    case "REQUIRED": return prev.required(curr.message);
                    case "MIN": return prev.min(curr.min??0,curr.message);
                    case "MAX": return prev.min(curr.max??0,curr.message);
                    case "PATTERN": return prev.matches(curr.pattern ?? /.*/, curr.message);
                    default:{
                        console.warn('provided validation type is not supported for File input', curr.type)
                        return prev;
                    }
                }
            }

        }, value as yup.StringSchema)
        return {
            key: field.name,
            def: value
        } ;
    })
        .reduce((prev,curr)=>{
            prev[curr.key] = curr.def;
            return prev;
        },{} as {[fieldName: string] : yup.Schema})
    const validationSchema = yup.object(yupObject)
    const resolver = useYupValidationResolver(validationSchema);
    const {
        register,
        handleSubmit,
        watch,
        formState,
        reset,
        getValues
    } = useForm({resolver})

    const onSubmit: SubmitHandler = (data) => console.log('handling form submission',data)

    console.log('NewUser','formState',formState,watch('profilePicture')) // watch input value by passing the name of it

    const renderedFields = formDef.fields.map((field,index)=>{
        if(field.type === 'select'){
            return <SelectInput field={field} index={index} formState={formState} register={register} key={field.name+"-"+index}/>;
        }else if(field.type === 'file'){
            return <FileInput field={field} index={index} formState={formState} register={register} key={field.name+"-"+index} getValues={getValues}/>;
        }else{
            return <GenericInput field={field} index={index} formState={formState} register={register} key={field.name+"-"+index}/>;
        }
    }

    )
//https://react-hook-form.com/advanced-usage#SmartFormComponent
    return (
        <section id='NewUser'>
            New User
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* register your input into the hook by invoking the "register" function */}
                {renderedFields}


                <br/>
                <br/>
                <br/>
                <button className="button is-primary is-fullwidth" type="submit" >Submit</button>
                <br/>
                <button className="button is-primary is-outlined is-fullwidth" type="button" onClick={()=>reset()} >Reset</button>
            </form>
        </section>
    )
}

function GenericInput({field, index,register,formState}:{field:FieldDef,index: number, register: UseFormRegister, formState: FormState}){
    return (
        <div className="field is-horizontal" >
            <div className="field-label is-normal">
                <label className="label" htmlFor={field.name}>{field.label}</label>
            </div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        <input {...register(field.name,) } className={`input ${formState.errors.firstName?'is-danger':''}`} type="text" id={field.name+"-"+index} />
                        {formState.errors[field.name] &&  [formState.errors[field.name]?.message].flat().map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SelectInput({field, index,register,formState}:{field:FieldDef,index: number, register: UseFormRegister, formState: FormState}){
    return (
        <div className="field is-horizontal">
            <div className="field-label is-normal">
                <label className="label" htmlFor={field.name}>{field.label}</label>
            </div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        {/*<input {...register("gender")} className="input " type="email" id='gender' />*/}
                        <div  className={`select is-fullwidth ${formState.errors[field.name]?'is-danger':''}`}>
                            <select {...register(field.name)} id={field.name+index}  >
                                <option disabled value="" selected>Please Select Gender</option>
                                {field.selectOptions?.map(option => <option value={option.code} key={option.code}>{option.text}</option>)}
                                {/*<option value="male">Male</option>*/}
                                {/*<option value="female">Female</option>*/}
                            </select>
                        </div>
                        {formState.errors[field.name] &&  [formState.errors[field.name]?.message].flat().map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}


function FileInput({field, index,register,formState,getValues}:{field:FieldDef,index: number, register: UseFormRegister, formState: FormState, getValues: UseFormGetValues}){
    return (
        <div className="field is-horizontal">
        <div className="field-label is-normal">
            <label className="label" htmlFor={field.name}>{field.label}</label>
        </div>
        <div className="field-body">
            <div className="field">
                <div className="control">
                    <div className="file has-name">
                        <label className="file-label">
                            {/*<input  type="file"  {...register("profilePicture",)} className={`file-input ${formState.errors.profilePicture?'is-danger':''}`} id='profilePicture' />*/}
                            <input  type="file"  {...register(field.name) } className={`file-input  ${formState.errors.firstName?'is-danger':''}`} id={field.name+"-"+index} />
                            <span className="file-cta">
                              <span className="file-icon">
                                {/*<i className="fas fa-upload"></i>*/}
                                  <FontAwesomeIcon icon={faUpload} />
                              </span>
                              <span className="file-label">
                                Choose a file…
                              </span>
                            </span>
                            {getValues(field.name)&& getValues(field.name)[0] && <span className="file-name">{getValues(field.name)[0].name}</span>}

                        </label>
                    </div>
                    {formState.errors[field.name] &&  [formState.errors[field.name]?.message].flat().map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}


                </div>
            </div>
        </div>

    </div>
    );
}
