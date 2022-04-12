import { Action } from "routing-controllers";
import JwtService from "../services/JwtService";
import Container from "typedi";
import IUserCredential from "interfaces/IUserCredential";

const jwtService = Container.get(JwtService);

export function PreAuthorize(action: Action, roles: string[]): boolean {
    const authHeader = action.request.headers['authorization'];
    if (!authHeader) {
        return false;
    }
    const token = authHeader.replace('Bearer ', '');
    
    try {
        if (jwtService.isValidAcessToken(token)) {
            if (roles.length == 0) {
                return true;
            }
            const credential: IUserCredential = jwtService.getPayload(token);
            return roles.indexOf(credential.role) != -1;
        }

    }catch(err) {}
    return false;
}

export function CurrentUserChecker(action: Action) {
    if (PreAuthorize(action, [])) {
        const token = action.request.headers['authorization'].replace('Bearer ', '');
        console.log(token)

        const credential: IUserCredential = jwtService.getPayload(token);

        return credential;
    }
}