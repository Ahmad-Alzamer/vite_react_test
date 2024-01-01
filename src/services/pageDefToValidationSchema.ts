import {FieldDef} from "../UI/components/DynamicForm/types.ts";
import * as yup from "yup";

function getFileInputDef(field: FieldDef){


    let value = field.validations.reduce((prev, curr)=>{
        switch (curr.type){
            case "REQUIRED": return prev.test('required',curr.message ??'please select a file', (value:any) =>  value && (value as FileList).length>0);
            // case "MIN": return prev.test('fewFiles',curr.message?.replace('${VALIDATION-MIN-VALUE}',(curr.min??Number.MIN_VALUE)+"") ??'number of selected file is less than the required number', (value:any) =>  { console.info('file min',field.name,(value as FileList),(value as FileList).length); return value && (value as FileList).length>=(curr.min??Number.MIN_VALUE);});
            case "MAX": return prev.test('tooManyFiles',curr.message??'too many files selected', (value:any) =>  value && (value as FileList).length<=(curr.max??Number.MAX_VALUE));
            case "FILE-TYPE": return prev.test('fileType',curr.message??'the file type is not supported', (value?:any) => value &&(value as FileList)?.length<1 || value && Array.from(value as FileList).every(file => curr.supportedFileTypes?.has(file.type) ));
            default: {
                // console.warn('provided validation type is not supported for File input:', curr.type)
                return prev;
            }
        }

    }, yup.mixed().label(field.label))
    return {
        key: field.name,
        def: value
    } ;


}
function getFileTableInputDef(field: FieldDef){
    if(field.fileTableInput){
        const tableInputSchema = transformPageDefToValidationSchema([field.fileTableInput]);
        return {
            key: field.name,
            def: yup.array().label(field.fileTableInput.label).of(tableInputSchema)
        } ;
    }
}
function getGenericInputDef(field: FieldDef){
    let value = field.validations.reduce((prev, curr)=>{
        switch (curr.type){
            case "REQUIRED": return field.type==='select'? prev.test('required',curr.message??'please select a value', (value)=> value!=='placeholder') : prev.required(curr.message);
            case "MIN": return prev.min(curr.min??0,curr.message);
            case "MAX": return prev.min(curr.max??0,curr.message);
            case "PATTERN": return prev.matches(curr.pattern ?? /.*/, curr.message);
            default:{
                // console.warn('provided validation type is not supported for generic input:', curr.type)
                return prev;
            }
        }

    },  yup.string().label(field.label))
    return {
        key: field.name,
        def: value
    } ;



}

export function transformPageDefToValidationSchema(fields: Array<FieldDef>):yup.ObjectSchema{
    const yupObject = fields.map(field => {
        if(field.type === 'file'){
            return getFileInputDef(field);
        }if(field.type === 'file-table-input'){
            return getFileTableInputDef(field);

        }else{
            return getGenericInputDef(field);
        }

    }).filter(notEmpty)
        .reduce((prev,curr)=>{
            prev[curr.key] = curr.def;
            return prev;
        },{} as {[fieldName: string] : yup.Schema});
    return yup.object(yupObject);
}

function notEmpty<TValue>(input : TValue | null | undefined): input is TValue{
    return !!input;
}