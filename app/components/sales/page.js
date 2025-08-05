import { useState, useEffect } from "react";
import { salesService, inventoryService } from "../../Firebase/firebaseService";
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
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  DollarSign,
  Search,
  Receipt,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Sales({ onSaleCompleted }) {
  const [currentSale, setCurrentSale] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [recentSales, setRecentSales] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [items, sales] = await Promise.all([
        inventoryService.getItems(),
        salesService.getSales(10),
      ]);
      setAvailableItems(items);
      setRecentSales(sales);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = availableItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToSale = (item) => {
    const existingItem = currentSale.find(
      (saleItem) => saleItem.id === item.id
    );

    if (existingItem) {
      if (item.type === "product" && existingItem.quantity >= item.quantity) {
        toast.error("Not enough stock available");
        return;
      }

      setCurrentSale((prev) =>
        prev.map((saleItem) =>
          saleItem.id === item.id
            ? {
                ...saleItem,
                quantity: saleItem.quantity + 1,
                total: (saleItem.quantity + 1) * saleItem.price,
              }
            : saleItem
        )
      );
    } else {
      if (item.type === "product" && item.quantity <= 0) {
        toast.error("Item out of stock");
        return;
      }

      setCurrentSale((prev) => [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          total: item.price,
          type: item.type,
        },
      ]);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromSale(itemId);
      return;
    }

    const item = availableItems.find((i) => i.id === itemId);
    if (item && item.type === "product" && newQuantity > item.quantity) {
      toast.error("Not enough stock available");
      return;
    }

    setCurrentSale((prev) =>
      prev.map((saleItem) =>
        saleItem.id === itemId
          ? {
              ...saleItem,
              quantity: newQuantity,
              total: newQuantity * saleItem.price,
            }
          : saleItem
      )
    );
  };

  const removeFromSale = (itemId) => {
    setCurrentSale((prev) => prev.filter((item) => item.id !== itemId));
  };

  const calculateTotals = () => {
    const subtotal = currentSale.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const processSale = async () => {
    if (currentSale.length === 0) {
      toast.error("Please add items to the sale");
      return;
    }

    const { subtotal, tax, total } = calculateTotals();

    try {
      const newSale = {
        items: [...currentSale],
        subtotal,
        tax,
        total,
        paymentMethod,
        customerName: customerName || undefined,
        timestamp: new Date(),
      };

      const createdSale = await salesService.addSale(newSale);

      // Update inventory quantities for products
      for (const saleItem of currentSale) {
        const inventoryItem = availableItems.find(
          (item) => item.id === saleItem.id
        );
        if (inventoryItem && inventoryItem.type === "product") {
          const newQuantity = inventoryItem.quantity - saleItem.quantity;
          await inventoryService.updateQuantity(saleItem.id, newQuantity);
        }
      }

      setRecentSales((prev) => [createdSale, ...prev.slice(0, 9)]);

      // Trigger notification callback
      onSaleCompleted?.(createdSale);

      setCurrentSale([]);
      setCustomerName("");

      // Reload available items to reflect updated quantities
      const updatedItems = await inventoryService.getItems();
      setAvailableItems(updatedItems);

      toast.success(`Sale completed! Total: $${total.toFixed(2)}`);
    } catch (error) {
      console.error("Error processing sale:", error);
      toast.error("Failed to process sale");
    }
  };

  const { subtotal, tax, total } = calculateTotals();

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
        <h2>Борлуулалтын хэсэг</h2>
        <p className="text-muted-foreground">
          Борлуулалт болон гүйлгээний мэдээллүүд
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Сонгох бараа</CardTitle>
              <CardDescription>
                Одоогийн борлуулалтанд тохируулан бараагаа хайх
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Бараа хайх..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => addToSale(item)}
                    >
                      <div>
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ₮{item.price} •{" "}
                          {item.type === "product"
                            ? `${item.quantity} үлдэгдэлтэй`
                            : "Service"}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Сүүлийн борлуулалтууд</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSales.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Борлуулалт алга
                </p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recentSales.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="text-sm">
                          {sale.items.length} бараа
                          {sale.items.length !== 1 ? "s" : ""}
                          {sale.customerName && ` - ${sale.customerName}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sale.timestamp?.toDate
                            ? sale.timestamp.toDate().toLocaleTimeString()
                            : new Date(sale.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">${sale.total.toFixed(2)}</p>
                        <Badge variant="outline" className="text-xs">
                          {sale.paymentMethod}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Current Sale */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Одоогийн борлуулалт</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentSale.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Сонгосон бараа алга
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {currentSale.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between space-x-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ₮{item.price} ширхэгээр
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromSale(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Дүн:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Нийт дүн:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              {/* Customer & Payment */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="customer">Харилцагчийн нэр (Сонголтот)</Label>
                  <Input
                    id="customer"
                    placeholder="Харилцагчийн нэр оруулах"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment">Төлбөрийн төрөл</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Бэлэн</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="card">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Карт</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="digital">
                        <div className="flex items-center space-x-2">
                          <Receipt className="h-4 w-4" />
                          <span>Цахим хэтэвч</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={processSale}
                  disabled={currentSale.length === 0}
                  className="w-full"
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  Захиалга дуусгах
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
