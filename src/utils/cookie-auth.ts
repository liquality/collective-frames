import Cookies from "universal-cookie";
export const COOKIE_SIGNER_UUID = 'neynar_signer_uuid';
export const COOKIE_USER_FID = 'user_fid';
const cookies = new Cookies()

export class Auth {
    static removeUser() {
        cookies.remove(COOKIE_USER_FID)
        return true
    }

    static setUser(userFid?: number) {
        cookies.set(COOKIE_USER_FID, userFid)
        return true
    }

    static get fid() {
        return cookies.get(COOKIE_USER_FID)

    }
}
