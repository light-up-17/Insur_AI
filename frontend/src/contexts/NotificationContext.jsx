import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user, apiRequest } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      connectWebSocket();
    }
    return () => {
      if (ws) ws.close();
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await apiRequest(`http://localhost:8080/api/notifications/${user.id}`);
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const connectWebSocket = () => {
    const websocket = new WebSocket('ws://localhost:8080/ws/notifications');
    websocket.onopen = () => console.log('WebSocket connected');
    websocket.onclose = () => console.log('WebSocket disconnected');
    websocket.onerror = (error) => console.error('WebSocket error:', error);
    websocket.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        console.log('Received notification:', newNotification);
        if (newNotification.userId === user.id) {
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        } else {
          console.log('Notification for different user, ignoring');
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    setWs(websocket);
  };

  const markAsRead = async (id) => {
    try {
      const response = await apiRequest(`http://localhost:8080/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      if (unreadNotifications.length === 0) return;

      // Mark all unread notifications as read in bulk
      const promises = unreadNotifications.map(notification =>
        apiRequest(`http://localhost:8080/api/notifications/${notification.id}/read`, { method: 'PUT' })
      );

      await Promise.all(promises);

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
