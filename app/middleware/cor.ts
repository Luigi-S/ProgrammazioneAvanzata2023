import * as RequestMiddleware from './request_middleware';
import * as AuthMiddleware from './auth_middleware';

/// file contente le catene di middleware da impiegare
export const auth = [
    AuthMiddleware.checkAuthHeader, 
    AuthMiddleware.checkToken, 
    AuthMiddleware.verifyAndAuthenticate
];

export const isAdmin = auth.concat([AuthMiddleware.isAdmin]);

export const payload = [
    RequestMiddleware.checkPayloadHeader,
    RequestMiddleware.checkJSONPayload
];

export const validNewFood = [
    // TODO controllare se UNIQUE di name funziona, in caso contrario, aggiungere middleware per controllo nome originale
    RequestMiddleware.checkQuantityPositive
];

export const validUpdFood = [
    // TODO controllare se UNIQUE di name funziona, in caso contrario, aggiungere middleware per controllo nome originale
    RequestMiddleware.checkFoodExists,
    RequestMiddleware.checkQuantityPositive
];

export const any_other = [
    RequestMiddleware.notFound
]

export const error_handling =[
    RequestMiddleware.logErrors,
    RequestMiddleware.errorHandler
];