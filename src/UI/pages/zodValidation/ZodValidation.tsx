import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {z, ZodError, ZodIssue} from 'zod';
import {useController,  useForm} from "react-hook-form";

const fileTypes = new Set(['application/pdf']);

const fileValidation = z.instanceof(File).describe('File')
    .refine(file => fileTypes.has(file.type),{message:'only PDFs allowed'})
    .refine(file => file.size<10000000, {message: 'File too large'})

const fileArrayValidation = z.array(fileValidation).describe('fileArray')
        .min(2,{message: 'at least two files are needed'})
        .max(5,{message: 'at most five files are allowed'})
;


const formObjectValidation = z.object({fileArray: fileArrayValidation})
export function ZodValidation():React.JSX.Element{
    const [fileList,setFileList] = useState<Array<File>>()


    // const  formMethods = useForm<z.infer<typeof formObjectValidation>>({ values:{fileArray: []}, resolver: zodResolver(fileArrayValidation,{},{mode:'sync'})})
    const  formMethods = useForm<z.infer<typeof formObjectValidation>>({ resolver: customZodResolve})

    const controllerHook = useController({name: 'fileArray', control: formMethods.control, defaultValue:[]});
    async function onChange(e: React.ChangeEvent<HTMLInputElement>){
        setFileList(Array.from(e.target.files??[]) );
        const arr = e.target.files && Array.from(e.target.files) ||[];

        console.info('inside on change',typeof arr,arr,)
        controllerHook.field.onChange(arr);
        console.info(fileArrayValidation.safeParse(arr))
        console.info(formObjectValidation.safeParse({fileArray: arr}))
    }

    // console.info(typeof formMethods.watch(controllerHook.field.name), formMethods.watch(controllerHook.field.name))
    console.info('error messages',formMethods.formState.errors)
    return <>
        <form onSubmit={formMethods.handleSubmit(e=>{console.info('success', e)}, e=>{console.error('fail',e)})}>
            <div className="field is-horizontal">
                <div className="field-label is-normal">
                    <label className="label is-capitalized" htmlFor="file-array">File</label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <div className="control">
                            <div className="file has-name is-boxed">
                                <label className="file-label">
                                    <input
                                        multiple
                                        type="file"

                                        name={controllerHook.field.name}
                                        onChange={onChange}
                                        className={`file-input  ${formMethods.formState.errors[controllerHook.field.name] ? 'is-danger' : ''}`}
                                        id={"file-array"}
                                    />
                                    <span className="file-cta">
                                  <span className="file-icon">
                                      <FontAwesomeIcon icon={faUpload}/>
                                  </span>
                                  <span className="file-label">
                                    Choose a file…
                                  </span>
                                </span>
                                    {/*{Array.from(selectedFiles??[]).map(file => <abbr className="file-name" title={file.name} key={file.name} >{file.name}</abbr>)}*/}
                                    { (fileList?? []).map(file => <abbr className="file-name"
                                                                        title={file.name}
                                                                        key={file.name}>{file.name}</abbr>)}

                                </label>
                            </div>
                            {/*{formState.errors[overrideErrorMessageName ?? field.name] && [formState.errors[overrideErrorMessageName ??field.name]].flat().map(error => error?.message).map(message =>*/}
                            {/*    <p className="help is-danger"*/}
                            {/*       key={'error-message-' + field.name + "-" + message}>{message}*/}
                            {/*    </p>*/}
                            {/*)}*/}


                        </div>
                    </div>
                </div>

            </div>
            <button className='button is-info' type='submit'>submit</button>
        </form>
    </>
}




const isZodError = (error: any): error is ZodError => error.errors != null;

async function customZodResolve  (data:any)  {
    try {
        let  values =await formObjectValidation.parseAsync(data,)
        return {
            values,
            errors: {},
        }
    } catch (_errors) {
        console.info(_errors);
        if(isZodError(_errors )){
            console.info('resolver',JSON.stringify(_errors.errors,null, 2))
            return {
                values: {},
                errors: _errors.errors.reduce(
                    (accumulator: any, current: ZodIssue) => {
                        const [elementPath, ...restPath] = current.path;
                        let value= accumulator[elementPath];
                        if(!value){
                            value =[] as Array<{type: string,message: string,}>
                        }
                        const newErrorMessage = {
                            type: current.code ?? "validation",
                            message: current.message,
                            restPath: restPath
                        };
                        value = value.concat(newErrorMessage);

                        return {
                            ...accumulator,
                            [elementPath]: value,
                        };
                    },
                    {}
                ),
            }
        }
        throw _errors;

    }
}