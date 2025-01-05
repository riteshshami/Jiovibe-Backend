import { Request, Response } from 'express';
import { AppError } from '../utils/apperror';

// Create a new hub
export const createHub = async (req: Request, res: Response) => {
    try{

    } catch (error: any) {
        throw new AppError('Failed to create a new hub', 500);
    }
}

// Get all hubs
export const getAllHubs = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        res.send(`Create hub, ${id}`);
    } catch (error: any) {
        throw new AppError('Failed to create hub', 500);
    }
}

// Get joined hubs
export const getJoinedHubs = async (req: Request, res: Response) => {
    try{

    } catch (error: any) {
        throw new AppError('Failed to get joined hubs', 500);
    }
}

// Get one hub
export const getOneHub = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        res.send(`Create hub, ${id}`);
    } catch (error: any) {
        throw new AppError('Failed to create hub', 500);
    }
}

// Update a hub
export const updateHub = async (req: Request, res: Response) => {
    try{

    } catch (error: any) {
        throw new AppError('Failed to update hub', 500);
    }
}

// Delete a hub
export const deleteHub = async (req: Request, res: Response) => {
    try{

    } catch (error: any) {
        throw new AppError('Failed to delete hub', 500);
    }
}
