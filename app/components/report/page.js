import { useState, useEffect } from "react";
import { analyticsService } from "@/lib/firebaseService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Reports() {
  const [timePeriod, setTimePeriod] = useState("30");
  const [salesData, setSalesData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timePeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [sales, inventory] = await Promise.all([
        analyticsService.getSalesAnalytics(parseInt(timePeriod)),
        analyticsService.getInventoryAnalytics(),
      ]);
      setSalesData(sales);
      setInventoryData(inventory);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Track your store's performance and insights
          </p>
        </div>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              ${salesData?.totalRevenue?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Last {timePeriod} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{salesData?.totalTransactions || 0}</div>
            <p className="text-xs text-muted-foreground">Sales completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              ${salesData?.averageOrderValue?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              ${inventoryData?.totalValue?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Current stock value</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>
              Daily revenue for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData?.dailySales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>
              Value distribution across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryData?.categoryBreakdown || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) =>
                    `${category} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(inventoryData?.categoryBreakdown || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${value.toFixed(2)}`, "Value"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
            <CardDescription>
              Items that need restocking ({inventoryData?.lowStockCount || 0}{" "}
              items)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inventoryData?.lowStockItems?.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No low stock items
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {inventoryData?.lowStockItems?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{item.quantity} left</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Out of Stock Items</CardTitle>
            <CardDescription>
              Items that are completely out of stock (
              {inventoryData?.outOfStockCount || 0} items)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inventoryData?.outOfStockItems?.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No out of stock items
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {inventoryData?.outOfStockItems?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Items and value by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryData?.categoryBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name="Item Count" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
