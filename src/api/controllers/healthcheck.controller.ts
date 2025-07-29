import { Request, Response } from "express";

export const HealthCheck = async (req: Request, res: Response) => {
    return res.send('okay');
}