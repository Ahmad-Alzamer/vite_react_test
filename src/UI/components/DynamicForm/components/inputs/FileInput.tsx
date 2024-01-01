import {FieldDef} from "../../types.ts";
import React, {useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import {documentUpload} from "../../services/documentUpload.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";

export function FileInput({
                              field,
                              index,
                              overrideFieldName,
                              overrideErrorMessageName,
                              displayLabel = true,
                              setUploadedDocumentIds
                          }: {
    field: FieldDef,
    index: number,
    displayLabel: boolean,
    overrideFieldName?: string,
    overrideErrorMessageName?: string,
    setUploadedDocumentIds?: (input: { [fileName: string]: string }) => void
}): React.JSX.Element {
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
    //                             <inputs  type="file"
    //                                     className={`file-inputs  ${formState.errors.firstName?'is-danger':''}`}
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
    const {formState, register, getValues, trigger} = useFormContext();
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
    useEffect(() => {
        setSelectedFiles(getValues(field.name));
    }, [])

    async function _onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSelectedFiles(event.target.files);
        const isValid = await trigger(field.name);
        if (isValid) {
            console.info('all validations passed - some code here will upload the file to the backend API');
            const fileUploadsPromiseArray = Array.from(event.target.files ?? [])
                .map(async file => ({file: file, uploadResult: await documentUpload(file)}));
            const fileUploads = await Promise.all(fileUploadsPromiseArray);
            const fileName2DocumentIdMap = fileUploads
                .map(fileUpploadResult => ({
                    fileName: fileUpploadResult.file.name,
                    documentId: fileUpploadResult.uploadResult.documentId
                }))
                .reduce((prev, curr) => ({...prev, [curr.fileName]: curr.documentId}), {} as {
                    [fileName: string]: string
                });

            console.info('fileName2DocumentIdMap', fileName2DocumentIdMap)
            setUploadedDocumentIds && setUploadedDocumentIds(fileName2DocumentIdMap);

        }
    }

    const formHookRegisterResult = register(overrideFieldName ?? field.name, {onChange: _onChange});

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
                                    {...formHookRegisterResult}
                                    className={`file-input  ${formState.errors.firstName ? 'is-danger' : ''}`}
                                    id={field.name + "-" + index}
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
                                {Array.from(selectedFiles ?? []).map(file => <abbr className="file-name"
                                                                                   title={file.name}
                                                                                   key={file.name}>{file.name}</abbr>)}

                            </label>
                        </div>
                        {formState.errors[overrideErrorMessageName ?? field.name] && [formState.errors[overrideErrorMessageName ??field.name]].flat().map(error => error?.message).map(message =>
                            <p className="help is-danger"
                               key={'error-message-' + field.name + "-" + message}>{message}
                            </p>
                        )}


                    </div>
                </div>
            </div>

        </div>
    );
}