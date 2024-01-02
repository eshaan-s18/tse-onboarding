import { RequestHandler } from "express";
import TaskModel from "src/models/task";

export const getAllTasks: RequestHandler = async (req, res, next) => {
  try {
    const query = TaskModel.find();
    const sorted = await query.sort({ dateCreated: -1 });

    res.status(200).json(sorted);
  } catch (error) {
    next(error);
  }
};
