import { Request, Response, NextFunction } from "express"
import Joi from "joi"
import { Schema } from "joi";

interface ValidateOptions {
    body?: Schema;
    query?: Schema;
    params?: Schema;
}

export function validate(schemas: ValidateOptions) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (schemas.body) {
          req.body = await schemas.body.validateAsync(req.body, { abortEarly: false });
        }
  
        if (schemas.query) {
          req.query = await schemas.query.validateAsync(req.query, { abortEarly: false });
        }
  
        if (schemas.params) {
          req.params = await schemas.params.validateAsync(req.params, { abortEarly: false });
        }
  
        return next();
      } catch (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: (error as Joi.ValidationError).details?.map(detail => ({
            field: detail.path.join('.'), 
            message: detail.message 
          }))
        });
      }
    };
}

// example response ni if error:
// {
//   "status": "error",
//   "message": "Validation failed",
//   "errors": [
//     {
//       "field": "email",
//       "message": "\"email\" must be a valid email"
//     },
//     {
//       "field": "password",
//       "message": "\"password\" length must be at least 6 characters long"
//     }
//   ]
// }