import { useState, useEffect } from "react";

export function useNotifications(inventoryData) {
  const [notifications, setNotifications] = useState([]);

  // Generate notifications based on inventory data
  useEffect(() => {
    if (!inventoryData) return;

    const lowStockItems = inventoryData.filter(
      (item) =>
        item.type === "product" &&
        item.quantity <= item.lowStockThreshold &&
        item.quantity > 0
    );

    const outOfStockItems = inventoryData.filter(
      (item) => item.type === "product" && item.quantity === 0
    );

    // Generate low stock notifications
    lowStockItems.forEach((item) => {
      const existingNotification = notifications.find(
        (n) => n.message.includes(item.name) && n.title.includes("Low Stock")
      );

      if (!existingNotification) {
        const newNotification = {
          id: `low-stock-${item.id}`,
          type: "warning",
          title: "Low Stock Alert",
          message: `${item.name} has only ${item.quantity} units left`,
          timestamp: new Date(),
          read: false,
          actionable: true,
        };

        setNotifications((prev) => [newNotification, ...prev]);
      }
    });

    // Generate out of stock notifications
    outOfStockItems.forEach((item) => {
      const existingNotification = notifications.find(
        (n) => n.message.includes(item.name) && n.title.includes("Out of Stock")
      );

      if (!existingNotification) {
        const newNotification = {
          id: `out-of-stock-${item.id}`,
          type: "error",
          title: "Out of Stock",
          message: `${item.name} is completely out of stock`,
          timestamp: new Date(),
          read: false,
          actionable: true,
        };

        setNotifications((prev) => [newNotification, ...prev]);
      }
    });
  }, [inventoryData, notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const dismissNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications,
  };
}
