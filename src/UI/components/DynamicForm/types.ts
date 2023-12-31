
export type FormValidations = 'REQUIRED' | 'MIN' | 'MAX' | 'PATTERN' | 'FILE-TYPE' | 'PATTERN';
export interface FieldDef{
    name: string,
    label: string,
    type : 'text' | 'select' | 'file',
    selectOptions? : Array<{code: string, text: string}>,
    validations: Array<{type: FormValidations, message?: string, supportedFileTypes: Set<string>, min?: number, max?: number, pattern?: RegExp}>
}

export interface FormDef{
    id:{
        name: string,
        version: string,
    }
    header: string,
    pages:Array<PageDef>
}

export interface PageDef{
    id:string,
    header:string,
    fields: Array<FieldDef>
}