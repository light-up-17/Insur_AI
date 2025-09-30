import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationList = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="w-full max-w-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#333333]">
        <h3 className="text-lg font-semibold text-white">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-[#1cb08b] hover:text-[#0a8a6a] transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-gray-400 text-sm">No notifications yet</p>
            <p className="text-gray-500 text-xs mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-[#333333]">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-[#2a2a2a] transition-colors cursor-pointer ${
                  !notification.isRead ? 'bg-[#1a1a1a] border-l-4 border-[#1cb08b]' : ''
                }`}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Notification Icon */}
                  <div className="flex-shrink-0 text-lg">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${
                      notification.isRead ? 'text-gray-300' : 'text-white font-medium'
                    }`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(notification.timestamp)}
                      </span>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-[#1cb08b] rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="flex-shrink-0 text-xs text-[#1cb08b] hover:text-[#0a8a6a] transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-[#333333] text-center">
          <button className="text-sm text-[#1cb08b] hover:text-[#0a8a6a] transition-colors">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
