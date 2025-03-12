import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      validationErrors?: any[];
    }
  }
}

declare module 'express-serve-static-core' {
  interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): void | Promise<void> | Response<any, Record<string, any>> | Promise<Response<any, Record<string, any>>>;
  }
}
