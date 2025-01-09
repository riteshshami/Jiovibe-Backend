import { z } from "zod";
import { AppError } from "../../utils/appresponse.util";
import { logger } from "../../utils/logger.util"

export const getOneHub = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();

    try {
        // Validate input data
        
    } catch (error: any) {
        // log error
        logger.error('Error getting hub', {
            error: error.message,
            stack: error.stack,
            executionTime: Date.now() - startTime
        });

        if (error instanceof z.ZodError) {
            throw new AppError(
                'Validation failed: ' + error.errors.map(e => e.message).join(', '),
                400
            );
        }

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Failed to fetch the hub', 500);
    }
}
