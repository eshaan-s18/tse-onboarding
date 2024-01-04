import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Button, Page, UserTag, TaskForm } from "src/components";
import { getTask, type Task } from "src/api/tasks";
import { Routes, Route } from "react-router-dom";
import styles from "src/pages/TaskDetail.module.css";

export function TaskDetail() {
  const [task, setTask] = useState<Task | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getTask(id)
        .then((result) => {
          if (result.success) {
            setTask(result.data);
          } else {
            alert(result.error);
          }
        })
        .catch((error) => {
          console.error("Error fetching task: ", error);
        });
    }
  }, [id]);

  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = (updatedTask: Task) => {
    setTask(updatedTask);
    setIsEditing(false);
  };

  return (
    <Page>
      <Helmet>
        <title>{`${task?.title} | TSE Todos`}</title>
      </Helmet>
      <Routes>
        <Route path="/task/:id" />
      </Routes>
      <Link to="/">Back to home</Link>
      <div className={styles.page}>
        {isEditing ? (
          <TaskForm mode="edit" task={task} onSubmit={handleFormSubmit} />
        ) : (
          <>
            <div className={styles.pageRow}>
              <div className={styles.taskTitle}>
                {task?.title ? `${task?.title}` : "This task doesn't exist!"}
              </div>
              <Button
                className={task?.title ? "" : styles.hidden}
                kind="primary"
                type="button"
                data-testid="task-edit-button"
                label="Edit task"
                onClick={handleEditButtonClick}
              />
            </div>

            <div className={task?.title ? styles.taskDescription : styles.hidden}>
              {task?.description ? `${task?.description}` : "(No description)"}
            </div>

            <div className={task?.title ? styles.assigneeRow : styles.hidden}>
              <div className={styles.assignee}>Assignee</div>
              <UserTag
                userName={task?.assignee?.name || "Not assigned"}
                profilePicture={task?.assignee?.profilePictureURL}
              />
            </div>

            <div className={task?.title ? styles.statusRow : styles.hidden}>
              <div className={styles.status}>Status</div>
              <div>{task?.isChecked ? "Done" : "Not Done"}</div>
            </div>

            <div className={task?.title ? styles.dateRow : styles.hidden}>
              <div className={styles.date}>Date created</div>
              <div>
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "full",
                  timeStyle: "short",
                }).format(task?.dateCreated)}
              </div>
            </div>
          </>
        )}
      </div>
    </Page>
  );
}
