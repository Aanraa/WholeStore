import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Package,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import XLSX with proper module resolution

// Mock inventory data
const mockInventory = [
  { id: "1", name: "iPhone 13", price: 699, category: "Electronics" },
  { id: "2", name: "Samsung Galaxy S21", price: 599, category: "Electronics" },
  { id: "3", name: "Cotton T-Shirt", price: 25, category: "Clothing" },
  { id: "4", name: "Laptop Stand", price: 45, category: "Accessories" },
];

// Mock orders data
const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+1234567890",
    status: "pending",
    items: [
      { id: "1", name: "iPhone 13", quantity: 1, price: 699, total: 699 },
      { id: "3", name: "Cotton T-Shirt", quantity: 2, price: 25, total: 50 },
    ],
    subtotal: 749,
    tax: 59.92,
    total: 808.92,
    notes: "Customer prefers morning delivery",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "+1987654321",
    status: "completed",
    items: [
      {
        id: "2",
        name: "Samsung Galaxy S21",
        quantity: 1,
        price: 599,
        total: 599,
      },
    ],
    subtotal: 599,
    tax: 47.92,
    total: 646.92,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-16"),
  },
];

export default function Orders() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  // New order form state
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
    items: [],
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "default";
      case "processing":
        return "secondary";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      )
    );
    toast.success(
      `Order ${
        orders.find((o) => o.id === orderId)?.orderNumber
      } status updated to ${newStatus}`
    );
  };

  const addItemToNewOrder = (inventoryItem) => {
    const existingItem = newOrder.items.find(
      (item) => item.id === inventoryItem.id
    );

    if (existingItem) {
      setNewOrder((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === inventoryItem.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item
        ),
      }));
    } else {
      setNewOrder((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            id: inventoryItem.id,
            name: inventoryItem.name,
            quantity: 1,
            price: inventoryItem.price,
            total: inventoryItem.price,
          },
        ],
      }));
    }
  };

  const removeItemFromNewOrder = (itemId) => {
    setNewOrder((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const updateItemQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItemFromNewOrder(itemId);
      return;
    }

    setNewOrder((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity, total: quantity * item.price }
          : item
      ),
    }));
  };

  const calculateOrderTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const createOrder = () => {
    if (
      !newOrder.customerName ||
      !newOrder.customerEmail ||
      newOrder.items.length === 0
    ) {
      toast.error("Please fill in required fields and add items");
      return;
    }

    const { subtotal, tax, total } = calculateOrderTotals(newOrder.items);
    const orderNumber = `ORD-${String(orders.length + 1).padStart(3, "0")}`;

    const order = {
      id: Date.now().toString(),
      orderNumber,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      customerPhone: newOrder.customerPhone,
      status: "pending",
      items: [...newOrder.items],
      subtotal,
      tax,
      total,
      notes: newOrder.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setOrders((prev) => [order, ...prev]);
    setNewOrder({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      notes: "",
      items: [],
    });
    setShowCreateDialog(false);
    toast.success(`Order ${orderNumber} created successfully!`);
  };

  const exportToExcel = () => {
    try {
      const exportData = filteredOrders.map((order) => ({
        "Order Number": order.orderNumber,
        "Customer Name": order.customerName,
        "Customer Email": order.customerEmail,
        "Customer Phone": order.customerPhone,
        Status: order.status,
        "Items Count": order.items.length,
        Subtotal: order.subtotal,
        Tax: order.tax,
        Total: order.total,
        "Created Date": order.createdAt.toLocaleDateString(),
        "Updated Date": order.updatedAt.toLocaleDateString(),
        Notes: order.notes || "",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");
      XLSX.writeFile(
        wb,
        `orders-${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Orders exported to Excel successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export orders to Excel");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2>Order Management</h2>
          <p className="text-muted-foreground">
            Create and manage customer orders
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={exportToExcel}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>
                  Enter customer details and add items to create a new order
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h4>Customer Information</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        value={newOrder.customerName}
                        onChange={(e) =>
                          setNewOrder((prev) => ({
                            ...prev,
                            customerName: e.target.value,
                          }))
                        }
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={newOrder.customerEmail}
                        onChange={(e) =>
                          setNewOrder((prev) => ({
                            ...prev,
                            customerEmail: e.target.value,
                          }))
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone</Label>
                      <Input
                        id="customerPhone"
                        value={newOrder.customerPhone}
                        onChange={(e) =>
                          setNewOrder((prev) => ({
                            ...prev,
                            customerPhone: e.target.value,
                          }))
                        }
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newOrder.notes}
                        onChange={(e) =>
                          setNewOrder((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Order notes or special instructions"
                      />
                    </div>
                  </div>
                </div>

                {/* Items Selection */}
                <div className="space-y-4">
                  <h4>Add Items</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {mockInventory.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <p className="text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ${item.price}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addItemToNewOrder(item)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Items */}
              {newOrder.items.length > 0 && (
                <div className="space-y-4">
                  <h4>Selected Items</h4>
                  <div className="space-y-2">
                    {newOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-2 border rounded gap-2"
                      >
                        <div className="flex-1">
                          <p className="text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${item.price} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItemQuantity(
                                item.id,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-16"
                            min="1"
                          />
                          <span className="text-sm min-w-16">
                            ${item.total}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeItemFromNewOrder(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="border-t pt-4">
                    {(() => {
                      const { subtotal, tax, total } = calculateOrderTotals(
                        newOrder.items
                      );
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Tax (8%):</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-lg font-medium">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button onClick={createOrder}>Create Order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search orders, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Created
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {order.items.length} items
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          updateOrderStatus(order.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <Badge variant={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {order.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowViewDialog(true);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Order Details - {selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4>Customer Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="break-all">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{selectedOrder.customerPhone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4>Order Items</h4>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div>
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm">${item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h4>Notes</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p>{selectedOrder.createdAt.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p>{selectedOrder.updatedAt.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
