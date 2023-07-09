// SUCCESS
export const food_created_message: string = "CREATED - Food data successfully created";
export const order_created_message: string = "CREATED - Order data successfully created";
export const order_taken_message: string = "SUCCESS - Order successfully taken";
export const food_updated_message: string = "SUCCESS - Food data successfully updated";

// ERRORS
export const not_found_msg: string = "ERROR - Not found";
export const bad_request_msg: string = "ERROR - Bad request";
export const no_payload_msg: string = "Bad Request - No JSON payload header";
export const no_auth_header_message: string = "Bad Request - No authorization header";

export const missing_token_message: string = "Bad Request - Missing JWT Token";
export const invalid_token_message: string = "Forbidden - Invalid JWT Token";
export const malformed_payload_message: string = "Bad Request - Malformed payload";
export const unauthorized_message: string = "ERROR - Unauthorized";

export const internal_server_error_message: string = "ERROR - Internal server error";
export const unexisting_food_message: string = "Bad Request - Food not in database"
export const exceeded_quantity_message: string = "Bad Request - Your request exceeds storage"
export const already_taken_order_message: string = "Bad Request - Order is already taken or completed"

export const no_loads_msg: string = 'There are no loads associated with this order'