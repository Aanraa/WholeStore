import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db, auth } from "../Firebase/config";

// Helper function to get user-specific collection reference
const getUserCollection = (collectionName) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");
  return collection(db, "users", userId, collectionName);
};

// Inventory functions
export const inventoryService = {
  // Add new item to inventory
  async addItem(item) {
    try {
      const itemsRef = getUserCollection("inventory");
      const docRef = await addDoc(itemsRef, {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id: docRef.id, ...item };
    } catch (error) {
      console.error("Error adding item:", error);
      throw error;
    }
  },

  // Get all inventory items
  async getItems() {
    try {
      const itemsRef = getUserCollection("inventory");
      const querySnapshot = await getDocs(query(itemsRef, orderBy("name")));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting items:", error);
      throw error;
    }
  },

  // Update item quantity
  async updateQuantity(itemId, newQuantity) {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const itemRef = doc(db, "users", userId, "inventory", itemId);
      await updateDoc(itemRef, {
        quantity: newQuantity,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  },

  // Delete item
  async deleteItem(itemId) {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const itemRef = doc(db, "users", userId, "inventory", itemId);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  },

  // Listen to inventory changes
  onItemsChange(callback) {
    try {
      const itemsRef = getUserCollection("inventory");
      return onSnapshot(query(itemsRef, orderBy("name")), (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(items);
      });
    } catch (error) {
      console.error("Error setting up inventory listener:", error);
      throw error;
    }
  },
};

export const ordersService = {
  // Add new order
  async addOrder(order) {
    try {
      const ordersRef = getUserCollection("orders");
      const docRef = await addDoc(ordersRef, {
        ...order,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id: docRef.id, ...order };
    } catch (error) {
      console.error("Error adding order:", error);
      throw error;
    }
  },

  // Get all orders
  async getOrders(limitCount = 100) {
    try {
      const ordersRef = getUserCollection("orders");
      const querySnapshot = await getDocs(
        query(ordersRef, orderBy("createdAt", "desc"), limit(limitCount))
      );
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting orders:", error);
      throw error;
    }
  },

  // Get orders by status
  async getOrdersByStatus(status) {
    try {
      const ordersRef = getUserCollection("orders");
      const querySnapshot = await getDocs(
        query(
          ordersRef,
          where("status", "==", status),
          orderBy("createdAt", "desc")
        )
      );
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting orders by status:", error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const orderRef = doc(db, "users", userId, "orders", orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Update order details
  async updateOrder(orderId, updates) {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const orderRef = doc(db, "users", userId, "orders", orderId);
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  // Delete order
  async deleteOrder(orderId) {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const orderRef = doc(db, "users", userId, "orders", orderId);
      await deleteDoc(orderRef);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },

  // Get orders by date range
  async getOrdersByDateRange(startDate, endDate) {
    try {
      const ordersRef = getUserCollection("orders");
      const querySnapshot = await getDocs(
        query(
          ordersRef,
          where("createdAt", ">=", startDate),
          where("createdAt", "<=", endDate),
          orderBy("createdAt", "desc")
        )
      );
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting orders by date range:", error);
      throw error;
    }
  },

  // Listen to orders changes
  onOrdersChange(callback) {
    try {
      const ordersRef = getUserCollection("orders");
      return onSnapshot(
        query(ordersRef, orderBy("createdAt", "desc")),
        (snapshot) => {
          const orders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          callback(orders);
        }
      );
    } catch (error) {
      console.error("Error setting up orders listener:", error);
      throw error;
    }
  },
};

// Sales functions
export const salesService = {
  // Add new sale
  async addSale(sale) {
    try {
      const salesRef = getUserCollection("sales");
      const docRef = await addDoc(salesRef, {
        ...sale,
        createdAt: new Date(),
      });
      return { id: docRef.id, ...sale };
    } catch (error) {
      console.error("Error adding sale:", error);
      throw error;
    }
  },

  // Get all sales
  async getSales(limitCount = 50) {
    try {
      const salesRef = getUserCollection("sales");
      const querySnapshot = await getDocs(
        query(salesRef, orderBy("createdAt", "desc"), limit(limitCount))
      );
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting sales:", error);
      throw error;
    }
  },

  // Get sales by date range
  async getSalesByDateRange(startDate, endDate) {
    try {
      const salesRef = getUserCollection("sales");
      const querySnapshot = await getDocs(
        query(
          salesRef,
          where("createdAt", ">=", startDate),
          where("createdAt", "<=", endDate),
          orderBy("createdAt", "desc")
        )
      );
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting sales by date range:", error);
      throw error;
    }
  },

  // Listen to sales changes
  onSalesChange(callback) {
    try {
      const salesRef = getUserCollection("sales");
      return onSnapshot(
        query(salesRef, orderBy("createdAt", "desc")),
        (snapshot) => {
          const sales = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          callback(sales);
        }
      );
    } catch (error) {
      console.error("Error setting up sales listener:", error);
      throw error;
    }
  },
};

// Analytics functions
export const analyticsService = {
  // Get sales analytics
  async getSalesAnalytics(days = 30) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const sales = await salesService.getSalesByDateRange(startDate, endDate);

      // Calculate metrics
      const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
      const totalTransactions = sales.length;
      const averageOrderValue =
        totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

      // Group by date for daily sales chart
      const dailySales = sales.reduce((acc, sale) => {
        const date = sale.createdAt.toDate().toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, revenue: 0, transactions: 0 };
        }
        acc[date].revenue += sale.total;
        acc[date].transactions += 1;
        return acc;
      }, {});

      return {
        totalRevenue,
        totalTransactions,
        averageOrderValue,
        dailySales: Object.values(dailySales),
      };
    } catch (error) {
      console.error("Error getting sales analytics:", error);
      throw error;
    }
  },

  // Get inventory analytics
  async getInventoryAnalytics() {
    try {
      const items = await inventoryService.getItems();

      const totalItems = items.length;
      const totalValue = items.reduce(
        (sum, item) => sum + item.quantity * item.cost,
        0
      );
      const lowStockItems = items.filter(
        (item) =>
          item.type === "product" &&
          item.quantity <= (item.lowStockThreshold || 5)
      );
      const outOfStockItems = items.filter(
        (item) => item.type === "product" && item.quantity === 0
      );

      // Category breakdown
      const categoryBreakdown = items.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = { category: item.category, count: 0, value: 0 };
        }
        acc[item.category].count += 1;
        acc[item.category].value += item.quantity * item.cost;
        return acc;
      }, {});

      return {
        totalItems,
        totalValue,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
        categoryBreakdown: Object.values(categoryBreakdown),
        lowStockItems,
        outOfStockItems,
      };
    } catch (error) {
      console.error("Error getting inventory analytics:", error);
      throw error;
    }
  },
};
