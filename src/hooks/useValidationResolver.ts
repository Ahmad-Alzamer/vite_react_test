import {useCallback} from "react";
import * as yup from "yup";
export const useValidationResolver = (validationSchema: yup.ObjectSchema) =>
    useCallback(
        async (data:any) => {
            try {
                console.info('validation',data)
                const values = await validationSchema.validate(data, {
                    abortEarly: false,
                    // recursive:false

                })

                return {
                    values,
                    errors: {},
                }
            } catch (errors: yup.ValidationError) {
                return {
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
            }
        },
        [validationSchema]
    )
