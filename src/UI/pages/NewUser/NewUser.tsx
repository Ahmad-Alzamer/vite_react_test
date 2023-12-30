import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from "yup";
import {useYupValidationResolver} from "../../../hooks/useYupValidationResolver.ts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faUpload } from '@fortawesome/free-solid-svg-icons'


export function NewUser(){
    const validationSchema = yup.object({
        firstName: yup.string().label('First Name').required(),
        lastName: yup.string().label('Last Name').required(),
        gender: yup.string().label("Gender").required().oneOf(['male','female'],'please select a value for ${path}'),
        profilePicture: yup.mixed().label('Profile Picture')
            .test('required','please select a file', (value:any) =>  value && (value as FileList).length>0)
            .test('tooManyFiles','too many files selected', (value:any) =>  value && (value as FileList).length<=1)
            .test('fileType','the file type is not supported', (value?:any) =>  (value as FileList)?.length<1 || (value as FileList)[0]?.type ==='application/pdf')
        ,
        userName: yup.string().label('User Name').required().min(3).max(50),
        password: yup.string().label('Password')
            .matches(/[A-Z]+/,{message:'${path} must have at least one capital letter'})
            .matches(/[0-9]+/,{message:'${path} must have at least one number'})
            .matches(/[!@#$%^&*]+/,{message:'${path} must have at least one of the following special character:  !@#$%^&*'})
            .matches(/^[a-zA-Z0-9!@#$%^&*]*$/,{message:'${path} can only have alphanumeric and special characters:  !@#$%^&*'})
            .min(3)
            .max(20)
            // .te
        ,

    })
    const resolver = useYupValidationResolver(validationSchema);
    const {
        register,
        handleSubmit,
        watch,
        formState,
        reset,
        getValues
    } = useForm({resolver})

    const onSubmit: SubmitHandler = (data) => console.log('handling form submission',data)

    console.log('NewUser','formState',formState,watch('profilePicture')) // watch input value by passing the name of it
//https://react-hook-form.com/advanced-usage#SmartFormComponent
    return (
        <section id='NewUser'>
            New User
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* register your input into the hook by invoking the "register" function */}

                <div className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label className="label" htmlFor="firstName">First Name</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control">
                                <input {...register("firstName",) } className={`input ${formState.errors.firstName?'is-danger':''}`} type="text" id='firstName' />
                                {formState.errors.firstName &&  [formState.errors.firstName?.message].flat().map(message => <p className="help is-danger">{message }</p>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label className="label" htmlFor="lastName">Last Name</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control">
                                <input {...register("lastName",)} className={`input ${formState.errors.lastName?'is-danger':''}`} type="text" id='lastName' />
                                {formState.errors.lastName &&  [formState.errors.lastName?.message].flat().map(message => <p className="help is-danger">{message }</p>)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label className="label" htmlFor="lastName">Gender</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control">
                                {/*<input {...register("gender")} className="input " type="email" id='gender' />*/}
                                <div  className={`select is-fullwidth ${formState.errors.gender?'is-danger':''}`}>
                                    <select {...register("gender")} id='gender'  defaultValue="0">
                                        <option disabled value="0">Please Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                {formState.errors.gender &&  [formState.errors.gender?.message].flat().map(message => <p className="help is-danger">{message }</p>)}
                            </div>
                        </div>
                    </div>
                </div>



                <div className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label className="label" htmlFor="lastName">Profile Picture</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control">
                                <div className="file has-name">
                                    <label className="file-label">
                                        <input  type="file"  {...register("profilePicture",)} className={`file-input ${formState.errors.profilePicture?'is-danger':''}`} id='profilePicture' />
                                        <span className="file-cta">
                                          <span className="file-icon">
                                            {/*<i className="fas fa-upload"></i>*/}
                                              <FontAwesomeIcon icon={faUpload} />
                                          </span>
                                          <span className="file-label">
                                            Choose a file…
                                          </span>
                                        </span>
                                        {getValues('profilePicture')&& getValues('profilePicture')[0] && <span className="file-name">{getValues('profilePicture')[0].name}</span>}

                                    </label>
                                </div>
                                {formState.errors.profilePicture &&  [formState.errors.profilePicture?.message].flat().map(message => <p className="help is-danger">{message }</p>)}


                            </div>
                        </div>
                    </div>

                </div>






                <hr/>
                <div className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label className="label" htmlFor="userName">User Name</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control">
                                <input {...register("userName",)} className={`input ${formState.errors.userName?'is-danger':''}`} type="text" id='userName' />
                                {formState.errors.userName &&  [formState.errors.userName?.message].flat().map(message => <p className="help is-danger">{message }</p>)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label className="label" htmlFor="password">Password</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control">
                                <input {...register("password",)} className={`input ${formState.errors.password?'is-danger':''}`} type="text" id='password' />
                                {formState.errors.password &&  [formState.errors.password?.message].flat().map(message => <p className="help is-danger">{message }</p>)}
                            </div>
                        </div>
                    </div>
                </div>

                <br/>
                <br/>
                <br/>
                <button className="button is-primary is-fullwidth" type="submit" >Submit</button>
                <br/>
                <button className="button is-primary is-outlined is-fullwidth" type="reset" onClick={()=>reset()} >Reset</button>
            </form>
        </section>
    )
}