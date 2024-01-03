import React, { useState } from "react";
import type { Task } from "src/api/tasks";
import { CheckButton } from "src/components";
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
    updateTask({ ...task, isChecked: !task.isChecked }).then((result) => {
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
    </div>
  );
}
