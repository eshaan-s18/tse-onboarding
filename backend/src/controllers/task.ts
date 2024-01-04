/**
 * Functions that process task route requests.
 */

import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import TaskModel from "src/models/task";
import validationErrorParser from "src/util/validationErrorParser";

/**
 * This is an example of an Express API request handler. We'll tell Express to
 * run this function when our backend receives a request to retrieve a
 * particular task.
 *
 * Request handlers typically have 3 parameters: req, res, and next.
 *
 * @param req The Request object from Express. This contains all the data from
 * the API request. (https://expressjs.com/en/4x/api.html#req)
 * @param res The Response object from Express. We use this to generate the API
 * response for Express to send back. (https://expressjs.com/en/4x/api.html#res)
 * @param next The next function in the chain of middleware. If there's no more
 * processing we can do in this handler, but we're not completely done handling
 * the request, then we can pass it along by calling next(). For all of the
 * handlers defined in `src/controllers`, the next function is the global error
 * handler in `src/app.ts`.
 */
export const getTask: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const task = await TaskModel.findById(id).populate("assignee");

    if (task === null) {
      throw createHttpError(404, "Task not found.");
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  const { title, description, isChecked, assignee } = req.body;

  try {
    validationErrorParser(errors);

    const task = await TaskModel.create({
      title: title,
      description: description,
      isChecked: isChecked,
      dateCreated: Date.now(),
      assignee: assignee,
    });

    const populatedTask = await TaskModel.findById(task._id).populate("assignee");

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const removeTask: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await TaskModel.deleteOne({ _id: id });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateTask: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  const paramsID = req.params.id;
  const bodyID = req.body._id;

  try {
    validationErrorParser(errors);

    if (paramsID !== bodyID) {
      return res.status(400).json({ error: "IDs do not match" });
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(paramsID, req.body).populate("assignee");
    if (updatedTask === null) {
      throw createHttpError(404, "Task not found.");
    }

    const queriedUpdatedTask = await TaskModel.findById(paramsID);

    res.status(200).json(queriedUpdatedTask);
  } catch (error) {
    next(error);
  }
};
