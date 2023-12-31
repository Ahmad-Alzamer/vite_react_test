import {useCallback} from "react";
import * as yup from "yup";
export const useValidationResolver = (validationSchema: yup.ObjectSchema<any,any,any,any>) =>
    useCallback(
        async (data:any) => {
            try {
                let  values =await validationSchema.validate(data, {
                        abortEarly: false,
                    })
                return {
                    values,
                    errors: {},
                }
            } catch (_errors) {
                const errors = _errors as yup.ValidationError;
                return {
                    values: {},
                    errors: errors.inner.reduce(
                        (accumulator: any, current: any) => {
                            let value= accumulator[current.path];
                            if(!value){
                                value =[] as Array<{type: string,message: string,}>
                            }
                            const newErrorMessage = {
                                type: current.type ?? "validation",
                                message: current.message,
                            };
                            value = value.concat(newErrorMessage);

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
