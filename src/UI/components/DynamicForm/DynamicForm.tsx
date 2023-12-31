import * as yup from "yup";
import {useValidationResolver} from "../../../hooks/useValidationResolver.ts";
import {FormProvider, SubmitHandler,  useForm, useFormContext} from "react-hook-form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {FieldDef, FormDef, PageDef} from "./types.ts";
import React, {useEffect,  useState} from "react";
import useFormNavigation  from "../../../hooks/useFormNavigation.ts";


export function DynamicForm({formDef}:{formDef: FormDef}) : React.JSX.Element{
    const formNavigation = useFormNavigation(formDef);

    const currentPageDef =  formDef.pages
        .find(page => page.id === formNavigation.currentPage);

    const validationSchema = transformPageDefToValidationSchema(currentPageDef ?? {} as any);
    const resolver = useValidationResolver(validationSchema);


    const useFormMethods = useForm({resolver })

    console.info('firstName',useFormMethods.watch('firstName'))

    const onSubmit: SubmitHandler<any> = (data) => {
        console.log('handling page submission for page:',currentPageDef?.id,'current page data',data);
        if(formNavigation.hasNext){
            formNavigation.nextPage();
            // useFormMethods.reset(data);
        }else{
            console.info('last page submitted');
            useFormMethods.reset()
            formNavigation.firstPage();
        }
    }
    const onReset = () => {
        useFormMethods.reset();
        formNavigation.firstPage();
    }
    async function previousPage(){
        formNavigation.previousPage();
        await useFormMethods.trigger();

    }


    return (
        <section id={formDef.id.name}>
            <FormProvider {...useFormMethods}>
                <form onSubmit={useFormMethods.handleSubmit(onSubmit)} >
                    <div className='is-flex is-justify-content-center'><span className='is-capitalized'>{formDef.header}</span></div>
                    <hr/>
                    {currentPageDef && <FormPage pageDef={currentPageDef} /> }


                    <br/>
                    <br/>
                    <br/>
                    <div className='is-flex is-justify-content-center '>
                        <button className="button is-info is-outlined mx-3 " type="reset" onClick={onReset} >Reset</button>
                        {formNavigation.hasPrevious && <button className="button is-info mx-3" type="button"  onClick={previousPage} >Previous</button>}
                        <button className="button is-info mx-3" type="submit" >{formNavigation.hasNext? 'Next': 'Submit'}</button>
                    </div>

                    <br/>
                </form>
            </FormProvider>


        </section>
    )
}

function FormPage({pageDef}:{pageDef: PageDef}) : React.JSX.Element{
    const renderedFields = pageDef.fields.map((field,index)=>{
            if(field.type === 'select'){
                return <SelectInput field={field} index={index}  key={field.name+"-"+index} />;
            }else if(field.type === 'file'){
                return <FileInput field={field} index={index}  key={field.name+"-"+index} />;
            }else{
                return <GenericInput field={field} index={index} key={field.name+"-"+index} />;
            }
        }

    )


    //https://codesandbox.io/p/sandbox/practical-kirch-pd9s3l?file=%2Fsrc%2FMultiStepForm.js%3A97%2C7


    return (
        <>
            <div className='is-flex is-justify-content-center'><span className='is-capitalized'>{pageDef.header}</span></div>
            <hr/>

            {renderedFields}


        </>
    )
}




function GenericInput({field,index}:{field:FieldDef,index: number}): React.JSX.Element{
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
    const {formState,register} = useFormContext();
    return (
        <div className="field is-horizontal" >
            <div className="field-label is-normal">
                <label className="label" htmlFor={field.name}>{field.label}</label>
            </div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        <input {...register(field.name,) } className={`input ${formState.errors[field.name]?'is-danger':''}`} type={field.type} id={field.name+"-"+index}  autoComplete={field.name} />
                        {formState.errors[field.name] &&  [formState.errors[field.name]].flat().map(error => error?.message).map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SelectInput({field,index,}:{field:FieldDef,index: number}): React.JSX.Element {
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
    const {formState,register} = useFormContext();
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
                        {formState.errors[field.name] &&  [formState.errors[field.name]].flat().map(error => error?.message).map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}


function FileInput({field,index}:{field:FieldDef,index: number,}): React.JSX.Element{
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
    const {formState,register,getValues} = useFormContext();
    const [selectedFiles, setSelectedFiles] = useState<FileList|null>(null)
    useEffect(()=>{
        setSelectedFiles(getValues(field.name));
    },[])
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
                                {/*{Array.from(selectedFiles??[]).map(file => <abbr className="file-name" title={file.name} key={file.name} >{file.name}</abbr>)}*/}
                                {Array.from(selectedFiles??[]).map(file => <abbr className="file-name" title={file.name} key={file.name} >{file.name}</abbr>)}

                            </label>
                        </div>
                        {formState.errors[field.name] &&  [formState.errors[field.name]].flat().map(error => error?.message).map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}


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