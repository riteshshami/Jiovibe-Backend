import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/apperror';

export const isModerator = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        throw new AppError("Failed to verify user role", 500);
    }
};
