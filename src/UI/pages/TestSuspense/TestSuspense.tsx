import {Suspense} from "react";
import {useQuery} from "react-query";
import {getUsers, User} from "../../../services/userService.ts";
import {AxiosError} from "axios";

export function TestSuspense(){
    return<Suspense  fallback={<>Loading Data</>} >
        <SuspenseChild/>
    </Suspense>
}


function SuspenseChild(){
    const {data,  isError,error} = useQuery<Array<User>,AxiosError>(['users'],()=>getUsers(),{retry:0, staleTime: 1000*60*10, suspense:true})

    if(isError){
        throw error;
    }
    return <>
        data loading completed.
        <pre>
            {JSON.stringify(data,null, 2)}
        </pre>
    </>
}