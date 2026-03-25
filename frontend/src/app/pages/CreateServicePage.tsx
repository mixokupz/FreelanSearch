import { Link, useParams } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Plus, X, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreateServicePage() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryTime: "",
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      isEditing ? "Услуга успешно обновлена!" : "Услуга успешно создана!"
    );
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-6">
            <Link
              to="/dashboard"
              className="text-blue-600 hover:underline"
            >
              ← Назад к кабинету
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {isEditing ? "Редактировать услугу" : "Создать новую услугу"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Название услуги *</Label>
                  <Input
                    id="title"
                    placeholder="Например: Разработка логотипа и фирменного стиля"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-600">
                    Краткое и понятное название, которое привлечёт клиентов
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категория *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="design">Дизайн</SelectItem>
                      <SelectItem value="development">Разработка</SelectItem>
                      <SelectItem value="marketing">Маркетинг</SelectItem>
                      <SelectItem value="writing">Тексты</SelectItem>
                      <SelectItem value="video">Видео и анимация</SelectItem>
                      <SelectItem value="music">Музыка и аудио</SelectItem>
                      <SelectItem value="translation">Переводы</SelectItem>
                      <SelectItem value="consulting">Консалтинг</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание услуги *</Label>
                  <Textarea
                    id="description"
                    placeholder="Подробно опишите, что входит в услугу, какие задачи вы решаете, ваш опыт..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={6}
                    required
                  />
                  <p className="text-sm text-gray-600">
                    Чем подробнее описание, тем больше шансов получить заказ
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Цена (₽) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="15000"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-600">Фиксированная стоимость</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">Срок выполнения (дней) *</Label>
                    <Input
                      id="deliveryTime"
                      type="number"
                      placeholder="7"
                      value={formData.deliveryTime}
                      onChange={(e) => handleChange("deliveryTime", e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-600">Количество дней</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Теги</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Добавьте тег"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-2">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Теги помогут клиентам найти вашу услугу
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Изображения (необязательно)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      Перетащите изображения сюда или нажмите для выбора
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Максимум 5 изображений, PNG или JPG
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6 flex gap-4">
                  <Button type="submit" size="lg" className="flex-1">
                    {isEditing ? "Сохранить изменения" : "Создать услугу"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link to="/dashboard">Отмена</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}