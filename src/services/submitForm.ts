import axios from "axios";
import {FormDef} from "../UI/components/DynamicForm/types.ts";

function preprocessFormData(formData: any,formDef: FormDef,uploadedDocumentIds:{[fileName:string]:string}){

    const fileTableInputs = formDef.pages.flatMap(page => page.fields)
        .filter(field => field.type === 'file-table-input')
        .map(field => ({name: field.name, fileTableInput: field.fileTableInput, value: (formData[field.name] as Array<{file:File, [tableInputName:string]:string|File}>) }))
        .map(field => (
            {
                name:field.name,
                value: field.value.map( row => (
                    {
                        documentName: row.file.name,
                        documentId: uploadedDocumentIds[row.file.name],
                        [field.name]:row[field.fileTableInput?.name??'']
                    }
                ))
            })
        )
        .reduce((prev,curr)=>({...prev, [curr.name]:curr.value}), {} as {[fieldName:string]:any})
    const restOfFields= formDef.pages.flatMap(page => page.fields)
        .filter(field => field.type !== 'file' )
        .filter(field => field.type !== 'file-table-input')
        .map(field => ({name: field.name, value: formData[field.name]}))
        .reduce((prev,curr)=>({...prev, [curr.name]:curr.value}), {} as {[fieldName:string]:string})

    return {...restOfFields,...fileTableInputs}
}
export async function submitForm(formData: any,formDef: FormDef,uploadedDocumentIds:{[fileName:string]:string}){
    const result = await axios.post('submitForm', preprocessFormData(formData,formDef,uploadedDocumentIds))
    return result.data as {status: string};


}