import express from "express";
import { getAllJobRoles } from "../services/JobRoleService";

export const getJobRoles = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('job-role-list.html', { jobRoles: await getAllJobRoles()});
}