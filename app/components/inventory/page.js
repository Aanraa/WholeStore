import { useState, useEffect } from "react";
import { inventoryService } from "../../Firebase/firebaseService";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  Package,
  Plus,
  Minus,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Inventory({ onStockUpdate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantityAdjustment, setQuantityAdjustment] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const items = await inventoryService.getItems();
      setInventory(items);
    } catch (error) {
      console.error("Error loading inventory:", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(
    new Set(inventory.map((item) => item.category))
  );

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  const lowStockItems = inventory.filter(
    (item) =>
      item.type === "product" && item.quantity <= (item.lowStockThreshold || 5)
  );

  const handleQuantityAdjustment = async () => {
    if (!selectedItem || !quantityAdjustment) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const adjustment = parseInt(quantityAdjustment);
    if (isNaN(adjustment) || adjustment <= 0) {
      toast.error("Please enter a valid positive number");
      return;
    }

    const oldQuantity = selectedItem.quantity;
    const newQuantity =
      adjustmentType === "add"
        ? oldQuantity + adjustment
        : Math.max(0, oldQuantity - adjustment);

    try {
      await inventoryService.updateQuantity(selectedItem.id, newQuantity);

      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === selectedItem.id) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );

      // Trigger notification callback
      onStockUpdate?.(selectedItem, oldQuantity, newQuantity);

      toast.success(
        `${
          adjustmentType === "add" ? "Added" : "Removed"
        } ${adjustment} units ${adjustmentType === "add" ? "to" : "from"} ${
          selectedItem.name
        }`
      );

      setSelectedItem(null);
      setQuantityAdjustment("");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const getStockStatus = (item) => {
    if (item.type === "service")
      return { label: "Үйлчилгээ", variant: "secondary" };
    if (item.quantity === 0)
      return { label: "Үлдэгдэлгүй болсон", variant: "destructive" };
    if (item.quantity <= (item.lowStockThreshold || 5))
      return { label: "Үлдэгдэл дуусжина", variant: "secondary" };
    return { label: "Үлдэгдэл байна", variant: "default" };
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setTypeFilter("all");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>Бараа хяналт</h2>
        <p className="text-muted-foreground">
          Барааны мэдээллээ шүүж цагаа хэмнээрэй
        </p>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-amber-200 bg-yellow-100 dark:border-amber-800 dark:bg-yellow-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>Low Stock Alert</span>
            </CardTitle>
            <CardDescription>
              {lowStockItems.length} бараанд анхаарал хэрэгтэй байна!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 bg-background rounded"
                >
                  <span>
                    {item.name} - {item.quantity} ширхэг үлдсэн байна
                  </span>
                  <Button size="sm" variant="outline">
                    Дахин захиалах
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Шүүлтүүр</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Хайх</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Барааны нэр болон SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Ангилал</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Бүх ангилал" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Бүх ангилал</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Төрөл</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Бүх төрөл" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Бүх төрөл</SelectItem>
                  <SelectItem value="product">Бараа</SelectItem>
                  <SelectItem value="service">Үйлчилгээ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={resetFilters}
              >
                <Filter className="mr-2 h-4 w-4" />
                Шүүлтүүр сэргээх
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Бүртгэгдсэн бараа ({filteredInventory.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Бараа</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Ангилал</TableHead>
                <TableHead>Төрөл</TableHead>
                <TableHead>Үнэ</TableHead>
                <TableHead>Тоо хэмжээ</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead>Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.sku}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.type == "service" ? "Үйлчилгээ" : "Бүтээгдэхүүн"}
                      </Badge>
                    </TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      {item.type === "service" ? "N/A" : item.quantity}
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.type === "product" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Package className="mr-1 h-3 w-3" />
                              Тохируулах
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Тоо хэмжээ засах</DialogTitle>
                              <DialogDescription>
                                Та энэхүү барааны нэршлийн хувьд засна :{" "}
                                {selectedItem?.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Одоогийн үлдэгдэл</Label>
                                  <div className="text-2xl">
                                    {selectedItem?.quantity || 0}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="adjustment-type">
                                    Үйлдэл
                                  </Label>
                                  <Select
                                    value={adjustmentType}
                                    onValueChange={setAdjustmentType}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="add">Нэмэх</SelectItem>
                                      <SelectItem value="remove">
                                        Хасах
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="quantity">Тоо ширхэг</Label>
                                <Input
                                  id="quantity"
                                  type="number"
                                  placeholder="Тоо оруулна уу"
                                  value={quantityAdjustment}
                                  onChange={(e) =>
                                    setQuantityAdjustment(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                className="bg-gray-800 hover:bg-gray-900"
                                onClick={handleQuantityAdjustment}
                              >
                                {adjustmentType === "add" ? (
                                  <Plus className="mr-2 h-4 w-4" />
                                ) : (
                                  <Minus className="mr-2 h-4 w-4" />
                                )}
                                {adjustmentType === "add"
                                  ? "Тоо нэмэх"
                                  : "Тоо хасах"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
