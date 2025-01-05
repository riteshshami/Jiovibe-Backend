import { Request, Response } from "express";
import { AppError } from "../utils/apperror";

// Add member to a hub
export const addMember = async (req: Request, res: Response) => {
  try {

  } catch (error: any) {
    throw new AppError("Failed to add member to hub", 500);
  }
};

// Get all members in a hub
export const getMembers = async (req: Request, res: Response) => {
  try {

  } catch (error: any) {
    throw new AppError("Failed to get members in hub", 500);
  }
};

// Get one member in a hub
export const getOneMember = async (req: Request, res: Response) => {
  try {

  } catch (error: any) {
    throw new AppError("Failed to get member in hub", 500);
  }
};

// Remove member from a hub
export const removeMember = async (req: Request, res: Response) => {
  try {

  } catch (error: any) {
    throw new AppError("Failed to remove member from hub", 500);
  }
};

export const roleChange = async (req: Request, res: Response) => {
  try {

  } catch (error: any) {
    throw new AppError("Failed to change user role", 500);
  }
}
