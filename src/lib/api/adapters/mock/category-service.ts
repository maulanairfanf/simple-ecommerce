import type { CategoryService } from "@/lib/api/contracts/category-service";
import type { Category } from "@/lib/types/commerce";

const categories: Category[] = [
  {
    id: "cat_pastries",
    slug: "pastries",
    name: "Pastries",
    description: "Flaky, buttery, and best near a window.",
    photoBrief: "Fresh morning pastries in a shallow metal tray with paper liners.",
    palette: "butter",
  },
  {
    id: "cat_breads",
    slug: "breads",
    name: "Breads",
    description: "Crackly loaves and soft slices for the middle of the table.",
    photoBrief: "Sliced country loaf with butter knife on a pale linen cloth.",
    palette: "oat",
  },
  {
    id: "cat_cakes",
    slug: "cakes",
    name: "Cakes",
    description: "Small occasions, large occasions, and no occasion at all.",
    photoBrief: "Layer cake with a single slice removed on a cake stand.",
    palette: "rose",
  },
  {
    id: "cat_sweets",
    slug: "sweets",
    name: "Sweets",
    description: "Cookies, tarts, and tiny things with a good crunch.",
    photoBrief: "Colorful tarts and cookies scattered on parchment paper.",
    palette: "jam",
  },
  {
    id: "cat_beverages",
    slug: "beverages",
    name: "Beverages",
    description: "Coffee, tea, and something cold for later.",
    photoBrief: "Iced tea and coffee on a bakery counter with condensation.",
    palette: "sage",
  },
  {
    id: "cat_gifts",
    slug: "gifts",
    name: "Gifts",
    description: "A pastry box, a note, and you are sorted.",
    photoBrief: "Pastry gift box tied with a wide jam-red ribbon.",
    palette: "cream",
  },
];

export const mockCategoryService: CategoryService = {
  async getAll(): Promise<Category[]> {
    return categories;
  },
};
