import axios from "axios";

export interface User{
    id: string,
    gender: string,
    firstName: string,
    lastName: string
}
export async function getUsers():Promise<Array<User>>{
    const response = await  axios('/api/users/');
    return response.data;
}