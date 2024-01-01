import {PageDef} from "../types.ts";
import React from "react";
import {Input} from "./Input.tsx";

export function FormPage({pageDef, setUploadedDocumentIds}: {
    pageDef: PageDef,
    setUploadedDocumentIds: (input: { [fileName: string]: string }) => void
}): React.JSX.Element {
    const renderedFields = pageDef.fields
        .map((field, index) => <Input field={field} index={index} key={field.name + "-" + index}
                                      setUploadedDocumentIds={setUploadedDocumentIds}/>)


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