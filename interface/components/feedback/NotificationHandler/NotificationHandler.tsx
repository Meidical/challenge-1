import styles from "./NotificationHandler.module.css";
import { useNotificationContext } from "@/contexts";

export default function NotificationHandler() {
  const { currentNotification } = useNotificationContext();

  return (
    <div className={styles.notificationHandler}>
      {currentNotification}
      {/* <Notification
        title="Engine Switched"
        description="The rules engine was changed!"
      />
      <Notification
        title="Error"
        description="Ops. An error ocurred!"
        connotation="Negative"
      />
      <Notification
        title="Success"
        description="Prevision concluded!"
        connotation="Positive"
      /> */}
    </div>
  );
}
