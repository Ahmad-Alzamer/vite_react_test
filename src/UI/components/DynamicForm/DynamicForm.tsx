import * as yup from "yup";
import {useValidationResolver} from "../../../hooks/useValidationResolver.ts";
import { SubmitHandler, useController, useForm} from "react-hook-form";
import {Control, FormState, UseFormGetValues, UseFormRegister} from "react-hook-form/dist/types/form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {FieldDef, FormDef, PageDef} from "./types.ts";
import React, {useEffect, useRef, useState} from "react";
import useFormNavigation, {UseFormNavigationResult} from "../../../hooks/useFormNavigation.ts";


export function DynamicForm({formDef}:{formDef: FormDef}) : React.JSX.Element{
    const formNavigation = useFormNavigation(formDef);

    const currentPageDef =  formDef.pages
        .find(page => page.id === formNavigation.currentPage);

    const [formData, setFormData] = useState({} as {[pageId: string]:{} } );



    function _setFormData(formData: any) {
        setFormData(formData)
    }
    function _setPageData(formData: any, pageId: string) {
        setFormData((prev: any) =>({...prev,[pageId]:formData}))
    }

    return (
        <section id={formDef.id.name}>
            <div className='is-flex is-justify-content-center'><span className='is-capitalized'>{formDef.header}</span></div>
            <hr/>
            {currentPageDef && <FormPage pageDef={currentPageDef} formNav={formNavigation} key={currentPageDef.id} setFormData={_setFormData} setPageData={_setPageData} pageData={formData[currentPageDef.id]??({} as any)}/> }
        </section>
    )
}

function FormPage({pageDef,formNav, setPageData,setFormData, pageData}:{pageDef: PageDef,formNav: UseFormNavigationResult, setPageData: (formData :any, pageId:string)=> void, setFormData: (formData :any)=> void, pageData:any}) : React.JSX.Element{

    const validationSchema = transformPageDefToValidationSchema(pageDef);

    const resolver = useValidationResolver(validationSchema);
    const {
        register,
        handleSubmit,
        formState,
        reset,
        getValues,
        control,
        watch
    } = useForm({resolver, values:pageData })

    console.info('firstName',watch('firstName'))

    const onSubmit: SubmitHandler<any> = (data) => {
        // reset();
        console.log('handling page submission for page:',pageDef.id,'current page data',data);
        setPageData(data,pageDef.id);
        if(formNav.hasNext){
            // setCurrentPage(formDef.pages[currentPageIndex+1].id);
            formNav.nextPage();
        }else{
            console.info('last page submitted');
            // reset()
            // setCurrentPage(formDef.pages[0].id)
            formNav.firstPage();
        }
    }
    const onReset = () => {
        reset()
        // setCurrentPage(formDef.pages[0].id)
        formNav.firstPage();
        setFormData({});
    }

    // console.log('NewUser','formState',formState,watch('profilePicture')) // watch input value by passing the name of it

    const renderedFields = pageDef.fields.map((field,index)=>{
            if(field.type === 'select'){
                return <SelectInput field={field} index={index} formState={formState} register={register} key={field.name+"-"+index} control={control}/>;
            }else if(field.type === 'file'){
                return <FileInput field={field} index={index} formState={formState} register={register} key={field.name+"-"+index} getValues={getValues} control={control}/>;
            }else{
                return <GenericInput control={control} field={field} index={index} formState={formState} register={register} key={field.name+"-"+index} fieldData={pageData[field.name]}/>;
            }
        }

    )

    return (
        <>
            <div className='is-flex is-justify-content-center'><span className='is-capitalized'>{pageDef.header}</span></div>
            <hr/>
            <form onSubmit={handleSubmit(onSubmit)}>
                {renderedFields}


                <br/>
                <br/>
                <br/>
                <div className='is-flex is-justify-content-center '>
                    <button className="button is-info is-outlined mx-3 " type="reset" onClick={onReset} >Reset</button>
                    {formNav.hasPrevious && <button className="button is-info mx-3" type="button" onClick={formNav.previousPage}  >Previous</button>}
                    <button className="button is-info mx-3" type="submit" >{formNav.hasNext? 'Next': 'Submit'}</button>
                </div>

                <br/>

            </form>
        </>
    )
}


function GenericInput({field,index,formState, control, register}:{field:FieldDef,index: number, register: UseFormRegister, formState: FormState, control: Control, fieldData: any}): React.JSX.Element{
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
    //                     <input
    //                         onChange={fieldController.field.onChange}
    //                         onBlur={fieldController.field.onBlur}
    //                         value = {fieldController.field.value}
    //                         // defaultValue={''}
    //                         className={`input ${formState.errors[field.name]?'is-danger':''}`}
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

    return (
        <div className="field is-horizontal" >
            <div className="field-label is-normal">
                <label className="label" htmlFor={field.name}>{field.label}</label>
            </div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        <input {...register(field.name,) } className={`input ${formState.errors[field.name]?'is-danger':''}`} type={field.type} id={field.name+"-"+index}  autoComplete={field.name} />
                        {formState.errors[field.name] &&  [formState.errors[field.name]?.message].flat().map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SelectInput({field,index,formState,register, control}:{field:FieldDef,index: number, register: UseFormRegister, formState: FormState, control: Control}): React.JSX.Element {
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

    return (
        <div className="field is-horizontal">
            <div className="field-label is-normal">
                <label className="label" htmlFor={field.name}>{field.label}</label>
            </div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        <div  className={`select is-fullwidth ${formState.errors[field.name]?'is-danger':''}`}>
                            <select {...register(field.name)} id={field.name+index} defaultValue='placeholder' >
                                <option disabled value='placeholder' >Please Select Gender</option>
                                {field.selectOptions?.map(option => <option value={option.code} key={option.code}>{option.text}</option>)}
                            </select>
                        </div>
                        {formState.errors[field.name] &&  [formState.errors[field.name]?.message].flat().map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}


function FileInput({field,index,formState, register, control,getValues}:{field:FieldDef,index: number, register: UseFormRegister, formState: FormState, control: Control,getValues:UseFormGetValues}): React.JSX.Element{
    // const fieldController = useController({
    //     name:field.name,
    //     control,
    // });
    // return (
    //     <div className="field is-horizontal">
    //         <div className="field-label is-normal">
    //             <label className="label" htmlFor={field.name+"-"+index}>{field.label}</label>
    //         </div>
    //         <div className="field-body">
    //             <div className="field">
    //                 <div className="control">
    //                     <div className="file has-name">
    //                         <label className="file-label">
    //                             <input  type="file"
    //                                     className={`file-input  ${formState.errors.firstName?'is-danger':''}`}
    //                                     id={field.name+"-"+index}
    //                                     name={fieldController.field.name}
    //                                     value={fieldController.field.value}
    //                                     onBlur={fieldController.field.onBlur}
    //                                     onChange={fieldController.field.onChange}
    //                                     ref={fieldController.field.ref}
    //                             />
    //                             <span className="file-cta">
    //                           <span className="file-icon">
    //                               <FontAwesomeIcon icon={faUpload} />
    //                           </span>
    //                           <span className="file-label">
    //                             Choose a file…
    //                           </span>
    //                         </span>
    //                             {getValues(field.name)&& getValues(field.name)[0] && <span className="file-name">{getValues(field.name)[0].name}</span>}
    //
    //                         </label>
    //                     </div>
    //                     {formState.errors[field.name] &&  [formState.errors[field.name]?.message].flat().map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}
    //
    //
    //                 </div>
    //             </div>
    //         </div>
    //
    //     </div>
    // );

    const [selectedFiles, setSelectedFiles] = useState<FileList|null>(null)
    function _onChange(event :React.ChangeEvent<HTMLInputElement>){
        setSelectedFiles(event.target.files);
    }
    const formHookRegisterResult = register(field.name,{onChange:_onChange});


    return (
        <div className="field is-horizontal">
            <div className="field-label is-normal">
                <label className="label" htmlFor={field.name}>{field.label}</label>
            </div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        <div className="file has-name is-boxed">
                            <label className="file-label">
                                <input
                                    multiple
                                    type="file"
                                    {...formHookRegisterResult }
                                    className={`file-input  ${formState.errors.firstName?'is-danger':''}`}
                                    id={field.name+"-"+index}
                                />
                                <span className="file-cta">
                                  <span className="file-icon">
                                      <FontAwesomeIcon icon={faUpload} />
                                  </span>
                                  <span className="file-label">
                                    Choose a file…
                                  </span>
                                </span>
                                {Array.from(selectedFiles??[]).map(file => <abbr className="file-name" title={file.name} key={file.name} >{file.name}</abbr>)}

                            </label>
                        </div>
                        {formState.errors[field.name] &&  [formState.errors[field.name]?.message].flat().map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}


                    </div>
                </div>
            </div>

        </div>
    );
}




function transformPageDefToValidationSchema(pageDef: PageDef){
    const yupObject = pageDef.fields.map(field => {
        let value = (field.type==='file'? yup.mixed() : yup.string()).label(field.label);

        value = field.validations.reduce((prev, curr)=>{
            if(field.type === 'file'){
                switch (curr.type){
                    case "REQUIRED": return prev.test('required',curr.message ??'please select a file', (value:any) =>  value && (value as FileList).length>0);
                    // case "MIN": return prev.test('fewFiles',curr.message?.replace('${VALIDATION-MIN-VALUE}',(curr.min??Number.MIN_VALUE)+"") ??'number of selected file is less than the required number', (value:any) =>  { console.info('file min',field.name,(value as FileList),(value as FileList).length); return value && (value as FileList).length>=(curr.min??Number.MIN_VALUE);});
                    case "MAX": return prev.test('tooManyFiles',curr.message??'too many files selected', (value:any) =>  value && (value as FileList).length<=(curr.max??Number.MAX_VALUE));
                    case "FILE-TYPE": return prev.test('fileType',curr.message??'the file type is not supported', (value?:any) => value &&(value as FileList)?.length<1 || value && Array.from(value as FileList).every(file => curr.supportedFileTypes.has(file.type) ));
                    default: {
                        // console.warn('provided validation type is not supported for File input:', curr.type)
                        return prev;
                    }
                }
            }else{
                switch (curr.type){
                    case "REQUIRED": return field.type==='select'? prev.test('required',curr.message??'please select a value', (value)=> {console.info('select validation',value); return value!=='placeholder';}) : prev.required(curr.message);
                    case "MIN": return prev.min(curr.min??0,curr.message);
                    case "MAX": return prev.min(curr.max??0,curr.message);
                    case "PATTERN": return prev.matches(curr.pattern ?? /.*/, curr.message);
                    default:{
                        // console.warn('provided validation type is not supported for generic input:', curr.type)
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
        },{} as {[fieldName: string] : yup.Schema});
    const validationSchema = yup.object(yupObject)   ;

    return validationSchema;
}