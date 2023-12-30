import { useForm, SubmitHandler } from "react-hook-form"
type Inputs = {
    firstName: string
    lastName: string
    gender: "male"|'female'
}

export function NewUser(){
    const {
        register,
        handleSubmit,
        watch,
        formState,
        reset
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log('handling form submission',data)

    console.log('NewUser',watch("firstName"),formState) // watch input value by passing the name of it

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
                            <p className="control">
                                <input {...register("firstName",{required: true})} className={`input ${formState.errors.firstName?'is-danger':''}`} type="text" id='firstName' />
                                {formState.errors.firstName &&  <p className="help is-danger">This field is required</p>}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label className="label" htmlFor="lastName">Last Name</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <p className="control">
                                <input {...register("lastName",{required:true, deps:'firstName'})} className={`input ${formState.errors.lastName?'is-danger':''}`} type="text" id='lastName' />
                                {formState.errors.lastName &&  <p className="help is-danger">This field is required</p>}
                            </p>
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
                                    <select {...register("gender", {validate: (value : any)=> value!=="0"})} id='gender'  defaultValue="0">
                                        <option disabled value="0">Please Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {formState.errors.gender &&  <p className="help is-danger">This field is required</p>}
                                </div>

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