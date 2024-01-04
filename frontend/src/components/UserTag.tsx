import React from "react";
// import { User } from "src/api/users";
import styles from "src/components/UserTag.module.css";

export interface UserTagProps {
  userName: string;
  profilePicture?: string;
  className?: string;
}

export function UserTag({ userName, profilePicture }: UserTagProps) {
  return (
    <div className={styles.userTagStyle}>
      <div className={styles.item}>
        {profilePicture ? (
          <img src={profilePicture} className={styles.profilePicture} />
        ) : (
          <img src="/userDefault.svg" />
        )}
        <h4 className={styles.userName}>{userName}</h4>
      </div>
    </div>
  );
}

export default UserTag;
