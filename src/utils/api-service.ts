import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import axios from "axios";

const ApiService = {
    authenticateUser: async function (neynarData: User) {
        const { data } = await axios.post(`/api/user/`, neynarData);
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
