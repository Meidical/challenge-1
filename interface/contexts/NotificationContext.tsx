import { cloneElement, createContext, useContext, useState } from "react";

type NotificationContextProps = {
  currentNotification: JSX.Element | null;
  setCurrentNotification: React.Dispatch<
    React.SetStateAction<JSX.Element | null>
  >;
};

const NotificationContext = createContext<NotificationContextProps>({
  currentNotification: null,
  setCurrentNotification: () => {},
});

export default function NotificationContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentNotification, setCurrentNotification] =
    useState<JSX.Element | null>(null);

  return (
    <NotificationContext.Provider
      value={{
        currentNotification,
        setCurrentNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => {
  const { currentNotification, setCurrentNotification } =
    useContext(NotificationContext);

  const pushNotification = (notification: JSX.Element) => {
    const key = crypto.randomUUID();
    const notificationWithKey = cloneElement(notification, { key });

    setCurrentNotification(notificationWithKey);
  };

  return {
    currentNotification,
    pushNotification,
  };
};
