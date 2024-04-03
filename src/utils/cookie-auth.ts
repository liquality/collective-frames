import Cookies from "universal-cookie";
export const COOKIE_SIGNER_UUID = 'neynar_signer_uuid';
export const COOKIE_USER_FID = 'user_fid';
const cookies = new Cookies()

export class Auth {
    static removeUser() {
        cookies.remove(COOKIE_SIGNER_UUID)
        cookies.remove(COOKIE_USER_FID)
        return true
    }

    static setUser(userFid: string, signerUuid: string) {
        cookies.set(COOKIE_USER_FID, userFid)
        cookies.set(COOKIE_SIGNER_UUID, signerUuid)
        return true
    }

    static get getUser() {
        return { userFid: cookies.get(COOKIE_USER_FID), signerUuid: cookies.get(COOKIE_SIGNER_UUID) }

    }
}
