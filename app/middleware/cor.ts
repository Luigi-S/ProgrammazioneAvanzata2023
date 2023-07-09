import * as RequestMiddleware from './request_middleware';
import * as AuthMiddleware from './auth_middleware';
import * as OrdersMiddleware from './orders_middleware';
import * as FeedMiddleware from './feed_middleware';


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
    FeedMiddleware.checkQuantityPositive
];

export const validUpdFood = [
    // TODO controllare se UNIQUE di name funziona, in caso contrario, aggiungere middleware per controllo nome originale
    FeedMiddleware.checkFoodExists,
    FeedMiddleware.checkQuantityPositive
];

export const validOrder = [
    OrdersMiddleware.checkValidOrder
]

export const takeOrder = [
    OrdersMiddleware.checkOrderExists,
    OrdersMiddleware.checkOrderNotStarted
]

export const orderState = [
    OrdersMiddleware.checkOrderExists
]

export const validPeriod = [
    RequestMiddleware.checkValidPeriod
];

export const any_other = [
    RequestMiddleware.notFound
]

export const error_handling =[
    RequestMiddleware.logErrors,
    RequestMiddleware.errorHandler
];