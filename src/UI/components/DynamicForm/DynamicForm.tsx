import {useValidationResolver} from "./hooks/useValidationResolver.ts";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {FormDef} from "./types.ts";
import React, {useState} from "react";
import useFormNavigation from "./hooks/useFormNavigation.ts";
import {transformPageDefToValidationSchema} from "./services/pageDefToValidationSchema.ts";
import {submitForm} from "./services/submitForm.ts";
import {FormPage} from "./components/FormPage.tsx";


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



