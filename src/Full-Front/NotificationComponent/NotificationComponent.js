import React, { useState, useEffect } from 'react';
import './NotificationComponent.css';

function NotificationComponent({ getNotifications }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications);
    }
    fetchNotifications();
  }, [getNotifications]);

  return (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <div key={index} className="notification">
          {notification.message}
        </div>
      ))}
    </div>
  );
}

export default NotificationComponent;
