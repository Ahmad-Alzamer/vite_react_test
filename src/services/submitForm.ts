import axios from "axios";
import {FormDef} from "../UI/components/DynamicForm/types.ts";

function preprocessFormData(formData: any,formDef: FormDef,uploadedDocumentIds:{[fileName:string]:string}){
    //get a map with the field name as the key and the uploaded files as array.
    // const fieldName2FileArray = formDef.pages.flatMap(page => page.fields)
    //     .filter(field => field.type === 'file')
    //     .map(field => ({name: field.name, value: formData[field.name]}))
    //     .reduce((prev,curr)=>({...prev, [curr.name]:curr.value}), {} as {[fieldName:string]:string})
    //
    // formDef.pages.flatMap(page => page.fields)
    //     .filter(field => field.type === 'file-table-input')
    //     .map(field => ({name: field.name, sourceFilesInputName : field.sourceFilesInputName, value: formData[field.name]}))
    //     .reduce((prev,curr)=>({...prev, [curr.name]:curr.value}), {} as {[fieldName:string]:string})

    return formDef.pages.flatMap(page => page.fields)
        .filter(field => field.type !== 'file' )
        .filter(field => field.type !== 'file-table-input')
        .map(field => ({name: field.name, value: formData[field.name]}))
        .reduce((prev,curr)=>({...prev, [curr.name]:curr.value}), {} as {[fieldName:string]:string})
}
export async function submitForm(formData: any,formDef: FormDef,uploadedDocumentIds:{[fileName:string]:string}){
    const result = await axios.post('submitForm', preprocessFormData(formData,formDef,uploadedDocumentIds), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return result.data as {status: string};


}