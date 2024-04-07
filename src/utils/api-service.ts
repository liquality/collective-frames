import axios from "axios";
import { StatusAPIResponse } from '@farcaster/auth-kit';

const ApiService = {
    authenticateUser: async function (authData: StatusAPIResponse) {
        const { data } = await axios.post(`/api/user/`, authData);
        return data
    },
    getFrameById: async function (frameId: string) {
        const { data } = await axios.get(`/api/frames/${frameId}`);
        return data
    },
    /* 
        getUser: async function (userId: number) {
            return null
        },
        getAllUsers: async function () {
            return null
        },
    
        updateUser: async function (userId: number, userObject: any) {
            return null
        } */
}
export default ApiService;
