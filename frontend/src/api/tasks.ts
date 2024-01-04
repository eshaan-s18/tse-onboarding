import { type APIResult, get, handleAPIError, post, put } from "src/api/requests";
import { User } from "src/api/users";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  isChecked: boolean;
  dateCreated: Date;
  assignee?: User;
}

interface TaskJSON {
  _id: string;
  title: string;
  description?: string;
  isChecked: boolean;
  dateCreated: string;
  assignee?: User;
}

function parseTask(task: TaskJSON): Task {
  return {
    _id: task._id,
    title: task.title,
    description: task.description,
    isChecked: task.isChecked,
    dateCreated: new Date(task.dateCreated),
    assignee: task.assignee,
  };
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignee?: string;
}

export interface UpdateTaskRequest {
  _id: string;
  title: string;
  description?: string;
  isChecked: boolean;
  dateCreated: Date;
  assignee?: string;
}

export async function createTask(task: CreateTaskRequest): Promise<APIResult<Task>> {
  try {
    const response = await post("/api/task", task);
    const json = (await response.json()) as TaskJSON;
    return { success: true, data: parseTask(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getTask(id: string): Promise<APIResult<Task>> {
  try {
    const response = await get(`/api/task/${id}`);
    const json = (await response.json()) as TaskJSON;
    return { success: true, data: parseTask(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getAllTasks(): Promise<APIResult<Task[]>> {
  try {
    const response = await get("/api/tasks");
    const json = await response.json();

    const tasks: Task[] = json.map((json: TaskJSON) => parseTask(json));

    return { success: true, data: tasks };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function updateTask(task: UpdateTaskRequest): Promise<APIResult<Task>> {
  try {
    const response = await put(`/api/task/${task._id}`, task);
    const json = (await response.json()) as TaskJSON;

    return { success: true, data: parseTask(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}
