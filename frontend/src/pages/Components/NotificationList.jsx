import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationList = () => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="notification-list">
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li key={notification.id} className={notification.isRead ? 'read' : 'unread'}>
              <p>{notification.message}</p>
              <small>{new Date(notification.timestamp).toLocaleString()}</small>
              {!notification.isRead && (
                <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
