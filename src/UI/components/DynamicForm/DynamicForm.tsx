import {useValidationResolver} from "../../../hooks/useValidationResolver.ts";
import {FormProvider, SubmitHandler, useFieldArray, useForm, useFormContext} from "react-hook-form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {FieldDef, FormDef, PageDef} from "./types.ts";
import React, {useEffect,  useState} from "react";
import useFormNavigation  from "../../../hooks/useFormNavigation.ts";
import {transformPageDefToValidationSchema} from "../../../services/pageDefToValidationSchema.ts";
import {documentUpload} from "../../../services/documentUpload.ts";
import {submitForm} from "../../../services/submitForm.ts";


export function DynamicForm({formDef}:{formDef: FormDef}) : React.JSX.Element{
    const [uploadedDocumentIds, setUploadedDocumentIds] = useState<{[fileName:string]:string}>({});
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const formNavigation = useFormNavigation(formDef);

    const currentPageDef =  formDef.pages
        .find(page => page.id === formNavigation.currentPage);

    const validationSchema = transformPageDefToValidationSchema(currentPageDef?.fields ?? []);
    const resolver = useValidationResolver(validationSchema);


    const useFormMethods = useForm({resolver })

    // console.info('firstName',useFormMethods.watch('firstName'))

    const onPageSubmit: SubmitHandler<any> = (data) => {
        console.log('handling page submission for page:',currentPageDef?.id,'collected data so far',data);
        formNavigation.nextPage();

    }

    const onFormSubmit: SubmitHandler<any> =async  (data) => {
        setShowProgressBar(true);
        try{
            console.log('handling last page submission for form:',formDef.id.name,'form data',data);
            const result = await submitForm(data,formDef,uploadedDocumentIds);
            console.info('form submission result',result)
            useFormMethods.reset()
            formNavigation.firstPage();
            setUploadedDocumentIds({});

        }catch (e){
            console.error('failed to submit form',e)
        }
        setShowProgressBar(false);
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
            <FormProvider {...useFormMethods} >
                <div className={`modal ${showProgressBar?'is-active':''}`}>
                    <div className="modal-background"></div>
                    <div className="modal-content">
                        <progress className="progress is-small is-info" max="100" ></progress>;
                    </div>
                    <button className="modal-close is-large" aria-label="close"></button>
                </div>
                <form >
                    <div className='is-flex is-justify-content-center'><span className='is-capitalized'>{formDef.header}</span></div>
                    <hr/>
                    {currentPageDef && <FormPage pageDef={currentPageDef} setUploadedDocumentIds={setUploadedDocumentIds} /> }


                    <br/>
                    <br/>
                    <br/>
                    <div className='is-flex is-justify-content-center '>
                        <button className="button is-info is-outlined mx-3 " type="reset" onClick={onReset} >Reset</button>
                        {formNavigation.hasPrevious && <button className="button is-info mx-3" type="button"  onClick={previousPage} >Previous</button>}
                        {formNavigation.hasNext && <button className="button is-info mx-3" type="submit"  onClick={useFormMethods.handleSubmit(onPageSubmit)}>Next</button>}
                        {!formNavigation.hasNext && <button className="button is-info mx-3" type="submit"  onClick={useFormMethods.handleSubmit(onFormSubmit)}>Submit</button>}
                    </div>

                    <br/>
                </form>
            </FormProvider>


        </section>
    )
}

function FormPage({pageDef,setUploadedDocumentIds}:{pageDef: PageDef, setUploadedDocumentIds: (input : {[fileName:string]:string})=> void }) : React.JSX.Element{
    const renderedFields = pageDef.fields
        .map((field,index)=><Input field={field} index={index}  key={field.name+"-"+index} setUploadedDocumentIds={setUploadedDocumentIds} />)


    //https://codesandbox.io/p/sandbox/practical-kirch-pd9s3l?file=%2Fsrc%2FMultiStepForm.js%3A97%2C7


    return (
        <>
            <div className='is-flex is-justify-content-center'>
                <span className='is-capitalized'>{pageDef.header}</span>
            </div>
            <hr/>

            {renderedFields}


        </>
    )
}
function Input({field,index, displayLabel=true,overrideFieldName, overrideErrorMessageName, setUploadedDocumentIds}:{field:FieldDef,index: number, displayLabel?: boolean, overrideFieldName?: string, overrideErrorMessageName?: string, setUploadedDocumentIds?: (input : {[fileName:string]:string})=> void}): React.JSX.Element{
    if(field.type === 'select'){
        return <SelectInput field={field} index={index}  key={field.name+"-"+index} displayLabel={displayLabel} overrideFieldName={overrideFieldName} overrideErrorMessageName={overrideErrorMessageName}/>;
    }else if(field.type === 'file'){
        return <FileInput field={field} index={index}  key={field.name+"-"+index} displayLabel={displayLabel} overrideFieldName={overrideFieldName} overrideErrorMessageName={overrideErrorMessageName} setUploadedDocumentIds={setUploadedDocumentIds}/>;
    }else if(field.type === 'file-table-input'){
        return <FileTableInput field={field} index={index}  key={field.name+"-"+index} displayLabel={displayLabel}/>;
    }else{
        return <GenericInput field={field} index={index} key={field.name+"-"+index} displayLabel={displayLabel} overrideFieldName={overrideFieldName} overrideErrorMessageName={overrideErrorMessageName}/>;
    }
}



function GenericInput({field,index,overrideFieldName,overrideErrorMessageName,displayLabel=true}:{field:FieldDef,index: number, displayLabel: boolean, overrideFieldName?: string, overrideErrorMessageName?: string}): React.JSX.Element{
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
            {displayLabel && (
                <div className="field-label is-normal">
                    <label className="label is-capitalized" htmlFor={field.name}>{field.label}</label>
                </div>
            )}
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        <input {...register(overrideFieldName??field.name,) } className={`input ${formState.errors[field.name]?'is-danger':''}`} type={field.type} id={field.name+"-"+index}  autoComplete={field.name} />
                        {formState.errors[overrideErrorMessageName??field.name] &&  [formState.errors[overrideErrorMessageName??field.name]].flat().map(error => error?.message).map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SelectInput({field,index,overrideFieldName,overrideErrorMessageName,displayLabel=true}:{field:FieldDef,index: number, displayLabel: boolean, overrideFieldName?: string, overrideErrorMessageName?: string}): React.JSX.Element {
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
            {displayLabel && (
                <div className="field-label is-normal">
                    <label className="label is-capitalized" htmlFor={field.name}>{field.label}</label>
                </div>
            )}
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        <div  className={`select is-fullwidth ${formState.errors[field.name]?'is-danger':''}`}>
                            <select {...register(overrideFieldName??field.name)} id={field.name+index} defaultValue='placeholder'  className='is-capitalized'>
                                <option disabled value='placeholder'  >{field.placeHolder?? 'Please Select Value'}</option>
                                {field.selectOptions?.map(option => <option value={option.code} key={option.code}>{option.text}</option>)}
                            </select>
                        </div>
                        {formState.errors[overrideErrorMessageName??field.name] &&  [formState.errors[overrideErrorMessageName??field.name]].flat().map(error => error?.message).map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}


function FileTableInput({field,}:{field:FieldDef,index: number, displayLabel: boolean}): React.JSX.Element {
    const tableInput = field.fileTableInput;


    const { watch,getValues} = useFormContext();
    const { fields,replace } = useFieldArray({
        name:  field.name,

    });
    const files = watch(field.sourceFilesInputName??'') as FileList;

    useEffect(()=>{
        const previousValue =getValues('accountDocumentsTypes');
        console.info('inside file table input', previousValue)
        if(!previousValue || (previousValue as Array<any>).length===0){
            replace(Array.from(files).map(file => ({file: file})));
        }

        // replace(new Array(files.length).fill({test:23}));

    },[files]);
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
            {fields.map((_field,index) => (
                <tr key={_field.id}>
                    <td>{files.item(index)?.name??''}</td>
                    {tableInput && <td><Input field={tableInput} index={index} displayLabel={false} overrideFieldName={`${field.name}.${index}.${tableInput.name??''}`} overrideErrorMessageName={`${field.name}[${index}].${tableInput?.name??''}`} /></td>}
                </tr>
            ))}


            </tbody>
        </table>
    );
}


function FileInput({field,index,overrideFieldName,overrideErrorMessageName,displayLabel=true, setUploadedDocumentIds}:{field:FieldDef,index: number, displayLabel: boolean, overrideFieldName?: string, overrideErrorMessageName?: string, setUploadedDocumentIds?: (input : {[fileName:string]:string})=> void }): React.JSX.Element{
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
    const {formState,register,getValues,trigger} = useFormContext();
    const [selectedFiles, setSelectedFiles] = useState<FileList|null>(null)
    useEffect(()=>{
        setSelectedFiles(getValues(field.name));
    },[])

    async function _onChange(event :React.ChangeEvent<HTMLInputElement>){
        setSelectedFiles(event.target.files);
        const isValid = await trigger(field.name);
        if(isValid){
            console.info('all validations passed - some code here will upload the file to the backend API');
            const fileUploadsPromiseArray = Array.from(event.target.files??[])
                .map(async file =>({file: file, uploadResult: await documentUpload(file)}));
            const fileUploads = await Promise.all(fileUploadsPromiseArray);
            const fileName2DocumentIdMap = fileUploads
                .map(fileUpploadResult => ({fileName: fileUpploadResult.file.name, documentId: fileUpploadResult.uploadResult.documentId}))
                .reduce((prev,curr)=>({...prev, [curr.fileName]: curr.documentId}), {} as {[fileName:string]:string});

            console.info('fileName2DocumentIdMap',fileName2DocumentIdMap)
            setUploadedDocumentIds && setUploadedDocumentIds(fileName2DocumentIdMap);

        }
    }
    const formHookRegisterResult = register(overrideFieldName??field.name,{onChange:_onChange});

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
                        {formState.errors[overrideErrorMessageName??field.name] &&  [overrideErrorMessageName??formState.errors[field.name]].flat().map(error => error?.message).map(message => <p className="help is-danger" key={'error-message-'+field.name+"-"+message}>{message }</p>)}


                    </div>
                </div>
            </div>

        </div>
    );
}



