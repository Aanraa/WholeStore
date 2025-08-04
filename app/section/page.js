"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Store,
  Package,
  Plus,
  BarChart3,
  ShoppingCart,
  TrendingUp,
  LogOut,
  Settings,
} from "lucide-react";
import CreateItem from "../components/createItemService";
import Inventory from "../components/inventory";
import Sales from "../components/sales";
import Reports from "../components/report";
import Orders from "../components/orders";
import Notifications from "../components/Notification";
import { useNotifications } from "../components/useNotification";
import { toast } from "sonner@2.0.3";

export default function Dashboard({ user }) {
  const [currentView, setCurrentView] = useState("overview");

  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  } = useNotifications();

  const navigationItems = [
    { id: "overview", label: "Overview", icon: Store },
    { id: "create", label: "Create Item", icon: Plus },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "sales", label: "Sales", icon: ShoppingCart },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "orders", label: "Orders", icon: BarChart3 },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out");
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "create":
        return (
          <CreateItem
            onItemCreated={(item) => {
              addNotification({
                type: "success",
                title: "Item Created",
                message: `${item.name} has been successfully added to inventory`,
                read: false,
              });
            }}
          />
        );
      case "inventory":
        return (
          <Inventory
            onStockUpdate={(item, oldQuantity, newQuantity) => {
              if (newQuantity <= item.lowStockThreshold && newQuantity > 0) {
                addNotification({
                  type: "warning",
                  title: "Low Stock Alert",
                  message: `${item.name} now has only ${newQuantity} units left`,
                  read: false,
                });
              } else if (newQuantity === 0) {
                addNotification({
                  type: "error",
                  title: "Out of Stock",
                  message: `${item.name} is now out of stock`,
                  read: false,
                });
              }
            }}
          />
        );
      case "orders":
        return (
          <Orders
            onStockUpdate={(item, oldQuantity, newQuantity) => {
              if (newQuantity <= item.lowStockThreshold && newQuantity > 0) {
                addNotification({
                  type: "warning",
                  title: "Low Stock Alert",
                  message: `${item.name} now has only ${newQuantity} units left`,
                  read: false,
                });
              } else if (newQuantity === 0) {
                addNotification({
                  type: "error",
                  title: "Out of Stock",
                  message: `${item.name} is now out of stock`,
                  read: false,
                });
              }
            }}
          />
        );
      case "sales":
        return (
          <Sales
            onSaleCompleted={(sale) => {
              addNotification({
                type: "success",
                title: "Sale Completed",
                message: `Sale of $${sale.total.toFixed(
                  2
                )} completed successfully`,
                read: false,
              });
            }}
          />
        );
      case "reports":
        return <Reports />;
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2>Welcome back, {user.email}!</h2>
              <p className="text-muted-foreground">
                Here's what's happening in your store today.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">23</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Today's Sales</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">$1,234</div>
                  <p className="text-xs text-muted-foreground">
                    +18% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Low Stock Items</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">2</div>
                  <p className="text-xs text-muted-foreground">
                    Requires attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Monthly Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">$12,470</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks to manage your store
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setCurrentView("create")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Item or Service
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setCurrentView("inventory")}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Manage Inventory
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setCurrentView("sales")}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Process Sale
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest transactions and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">Sale</Badge>
                    <span className="text-sm">iPhone 13 sold - $699</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">Stock</Badge>
                    <span className="text-sm">Added 50 units of T-Shirts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">New</Badge>
                    <span className="text-sm">
                      Created new service: Phone Repair
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-4 lg:px-6">
          <div className="flex items-center space-x-2">
            <Store className="h-6 w-6" />
            <span>Store Management</span>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <Notifications
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDismiss={dismissNotification}
            />
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  variant={currentView === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentView(item.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
