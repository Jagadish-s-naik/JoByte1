import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

export type NotificationType = 'application' | 'assessment' | 'profile' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  time: string;
  isRead: boolean;
  link: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'time'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'application',
      message: 'Your application for Senior React Developer at TechFlow has been received.',
      time: '2m ago',
      isRead: false,
      link: '/applicant/dashboard'
    },
    {
      id: '2',
      type: 'assessment',
      message: 'Action required: Complete your assessment for Frontend Engineer at Zentry.',
      time: '15m ago',
      isRead: false,
      link: '/jobs'
    },
    {
      id: '3',
      type: 'profile',
      message: 'A hiring manager from Nova Labs viewed your profile.',
      time: '1h ago',
      isRead: true,
      link: '/applicant/profile'
    },
    {
      id: '4',
      type: 'application',
      message: "You've been shortlisted for the Full Stack Developer role at CloudNine!",
      time: '3h ago',
      isRead: false,
      link: '/applicant/dashboard'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notif: Omit<Notification, 'id' | 'isRead' | 'time'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      isRead: false,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Real-time Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        type: 'system',
        message: 'New Job Alert: Quantum Systems Architect position fits your profile!',
        link: '/jobs'
      });
    }, 10000); // Add after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
