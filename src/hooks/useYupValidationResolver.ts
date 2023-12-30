import {useCallback} from "react";
import * as yup from "yup";
export const useYupValidationResolver = (validationSchema: yup.ObjectSchema) =>
    useCallback(
        async (data:any) => {
            console.info('inside callback', data)
            try {
                const values = await validationSchema.validate(data, {
                    abortEarly: false,
                    // recursive:false

                })

                return {
                    values,
                    errors: {},
                }
            } catch (errors: yup.ValidationError) {
                const result= {
                    values: {},
                    errors: errors.inner.reduce(
                        (accumulator: any, current: any) => {
                            let value= accumulator[current.path];
                            if(!value){
                                value ={
                                    type: current.type ?? "validation",
                                    message: [] as Array<string>,
                                }
                            }
                            value.message = value.message.concat(current.message);

                            return {
                                ...accumulator,
                                [current.path]: value,
                            };
                        },
                        {}
                    ),
                }
                console.error('inside callback catch',result)
                return result;
            }
        },
        [validationSchema]
    )
