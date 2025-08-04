import { useState, useEffect } from "react";
import { inventoryService } from "@/lib/firebaseService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
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
import { Package, Plus, Check } from "lucide-react";
import { toast } from "sonner@2.0.3";

export default function CreateItem({ onItemCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "product",
    category: "",
    price: "",
    cost: "",
    quantity: "",
    description: "",
    sku: "",
    lowStockThreshold: "5",
  });

  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Services",
    "Food & Beverage",
    "Other",
  ];

  useEffect(() => {
    loadRecentItems();
  }, []);

  const loadRecentItems = async () => {
    try {
      const items = await inventoryService.getItems();
      setRecentItems(items.slice(0, 5)); // Show last 5 items
    } catch (error) {
      console.error("Error loading recent items:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const newItem = {
        name: formData.name,
        type: formData.type,
        category: formData.category,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost) || 0,
        quantity:
          formData.type === "service" ? 0 : parseInt(formData.quantity) || 0,
        description: formData.description,
        sku: formData.sku || `${formData.type.toUpperCase()}-${Date.now()}`,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
      };

      const createdItem = await inventoryService.addItem(newItem);

      // Update recent items
      setRecentItems((prev) => [createdItem, ...prev.slice(0, 4)]);

      // Trigger notification callback
      onItemCreated?.(createdItem);

      // Reset form
      setFormData({
        name: "",
        type: "product",
        category: "",
        price: "",
        cost: "",
        quantity: "",
        description: "",
        sku: "",
        lowStockThreshold: "5",
      });

      toast.success(
        `${
          formData.type === "product" ? "Product" : "Service"
        } created successfully!`
      );
    } catch (error) {
      console.error("Error creating item:", error);
      toast.error("Failed to create item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Create New Item or Service</h2>
        <p className="text-muted-foreground">
          Add products or services to your store inventory
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>
                Enter the information for your new item or service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter item name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleInputChange("type", value)
                      }
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="Auto-generated if empty"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Selling Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost Price</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.cost}
                      onChange={(e) =>
                        handleInputChange("cost", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>

                  {formData.type === "product" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Initial Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="0"
                          value={formData.quantity}
                          onChange={(e) =>
                            handleInputChange("quantity", e.target.value)
                          }
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lowStockThreshold">
                          Low Stock Alert
                        </Label>
                        <Input
                          id="lowStockThreshold"
                          type="number"
                          placeholder="5"
                          value={formData.lowStockThreshold}
                          onChange={(e) =>
                            handleInputChange(
                              "lowStockThreshold",
                              e.target.value
                            )
                          }
                          disabled={loading}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter item description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Plus className="mr-2 h-4 w-4" />
                  {loading
                    ? "Creating..."
                    : `Create ${
                        formData.type === "product" ? "Product" : "Service"
                      }`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recently Created</CardTitle>
              <CardDescription>Your latest items and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No items created yet
                </p>
              ) : (
                recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm truncate">{item.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                      <p className="text-sm">${item.price}</p>
                    </div>
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
