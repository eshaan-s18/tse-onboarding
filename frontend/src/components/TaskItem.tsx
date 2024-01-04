import React, { useState } from "react";
import type { Task, UpdateTaskRequest } from "src/api/tasks";
import { CheckButton, UserTag } from "src/components";
import styles from "src/components/TaskItem.module.css";
import { updateTask } from "src/api/tasks";
import { Link } from "react-router-dom";

export interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task: initialTask }: TaskItemProps) {
  const [task, setTask] = useState<Task>(initialTask);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleToggleCheck = () => {
    setLoading(true);
    const updatedTask: UpdateTaskRequest = {
      _id: task?._id,
      title: task?.title || "",
      description: task?.description,
      isChecked: !task?.isChecked,
      dateCreated: task?.dateCreated,
      assignee: task?.assignee?._id, // Assign the assignee ID as a string or undefined
    };
    updateTask(updatedTask).then((result) => {
      if (result.success) {
        setTask(result.data);
      } else {
        alert(result.error);
      }
      setLoading(false);
    });
  };

  let textContainerClass = styles.textContainer;
  if (task.isChecked) {
    textContainerClass += ` ${styles.checked}`;
  }
  return (
    <div className={styles.item}>
      {<CheckButton checked={task.isChecked} onPress={handleToggleCheck} disabled={isLoading} />}
      <div className={textContainerClass}>
        <span>
          <Link to={`/task/${task._id}`} className={task.isChecked ? styles.checked : ""}>
            {task.title}
          </Link>
        </span>
        {task.description && <span className={styles.description}>{task.description}</span>}
      </div>
      {task.assignee?._id && (
        <UserTag userName={task.assignee.name} profilePicture={task.assignee.profilePictureURL} />
      )}
      {!task.assignee?._id && <h4 className={styles.h4}>Not assigned</h4>}
    </div>
  );
}
