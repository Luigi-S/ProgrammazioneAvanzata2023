// SUCCESS
// varie stringhe associate a HttpStatus positivi
export const food_created_message: string = "CREATED - Food data successfully created";
export const order_created_message: string = "CREATED - Order data successfully created";
export const order_taken_message: string = "SUCCESS - Order successfully taken";
export const food_updated_message: string = "SUCCESS - Food data successfully updated";
export const success_load_message: string = "SUCCESS - Load data successfully added";
export const token_updated_message: string = "SUCCESS - User's token amount updated successfully";

// ERRORS
// classe contente la tipologia di errore, come HttpStatus, ed il messaggio per il client 
export class ErrData{
    msg:string;
    status:number;
    constructor(msg:string, status:number){
        this.msg = msg;
        this.status = status;
    }
}
var HttpStatus = require('http-status-codes');

// elenco di ErrData utilizzati dal sistema
export const not_found_msg: ErrData = new ErrData("ERROR - Not found", HttpStatus.NOT_FOUND);
export const bad_request_msg: ErrData = new ErrData("ERROR - Bad request", HttpStatus.BAD_REQUEST);
export const no_payload_msg: ErrData = new ErrData("Bad Request - No JSON payload header", HttpStatus.BAD_REQUEST);
export const no_auth_header_message: ErrData = new ErrData("Bad Request - No authorization header", HttpStatus.BAD_REQUEST);

export const missing_token_message: ErrData = new ErrData("Bad Request - Missing JWT Token", HttpStatus.BAD_REQUEST);
export const invalid_token_message: ErrData = new ErrData("Forbidden - Invalid JWT Token", HttpStatus.UNAUTHORIZED);
export const malformed_payload_message: ErrData = new ErrData("Bad Request - Malformed payload", HttpStatus.BAD_REQUEST);
export const unauthorized_message: ErrData = new ErrData("ERROR - Unauthorized", HttpStatus.UNAUTHORIZED);

export const internal_server_error_message: ErrData = new ErrData("ERROR - Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
export const unexisting_food_message: ErrData = new ErrData("Bad Request - Food not in database", HttpStatus.BAD_REQUEST);
export const exceeded_quantity_message: ErrData = new ErrData("Bad Request - Your request exceeds storage", HttpStatus.BAD_REQUEST);
export const already_taken_order_message: ErrData = new ErrData("Bad Request - Order is already taken, completed or failed", HttpStatus.BAD_REQUEST);

export const not_next_message: ErrData = new ErrData("ORDER FAILED - The food loaded is in incorrect order", HttpStatus.INTERNAL_SERVER_ERROR);
export const unacceptable_q_message: ErrData = new ErrData("ORDER FAILED - The food loaded is in uncceptable quantity", HttpStatus.BAD_REQUEST);
export const not_enough_stored_message: ErrData = new ErrData("ORDER FAILED - The food loaded is in uncceptable quantity", HttpStatus.BAD_REQUEST);
export const already_existing_food_message: ErrData = new ErrData("Bad Request - Name selected for this food is already taken", HttpStatus.BAD_REQUEST);

export const not_executing_order_message: ErrData = new ErrData("LOAD FAILED - The order selected is not in execution, cannot load food", HttpStatus.INTERNAL_SERVER_ERROR);
export const repeated_food_message: ErrData = new ErrData("Bad request - Your order has repeated food(s), not allowed", HttpStatus.BAD_REQUEST);