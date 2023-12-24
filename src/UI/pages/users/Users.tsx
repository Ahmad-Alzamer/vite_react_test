import {useQuery} from "react-query";
import {AxiosError} from "axios";
import {getUsers, User} from "../../../services/userService.ts";

export function Users(){
    const result = useQuery<Array<User>,AxiosError>(['users'],()=>getUsers(),{retry:0})
    if(result.isLoading){
        return <progress className="progress is-small is-primary is-striped" max="100" ></progress>;
    }
    if(result.isError || result.isRefetchError || result.isLoadingError){
        return (
            <div className="notification is-danger">
                {/*<button className="delete"></button>*/}
                could not load data.
                <br/>
                {result.error.message}
            </div>
        );
    }
    return <>
        users
        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
            <thead>
            <tr>
                <th>ID</th>
                <th>Gender</th>
                <th>First Name</th>
                <th>Last Name</th>

            </tr>
            </thead>
            <tfoot>
            {/*<tr>*/}
            {/*    <th>ID</th>*/}
            {/*    <th>Gender</th>*/}
            {/*    <th>First Name</th>*/}
            {/*    <th>Last Name</th>*/}

            {/*</tr>*/}
            </tfoot>
            <tbody>
            {result.data && result.data.map(user => (
                <tr key={'user-row-'+user.id}>
                    <td>{user.id}</td>
                    <td>{user.gender}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>

                </tr>
            ))}


            </tbody>
        </table>
    </>
}