import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { MenuItem, PizzaSize } from '../types';

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: PizzaSize;
  selectedIngredients?: string[];
  selectedExtras?: string[];
  selectedPastaType?: string;
  selectedSauce?: string;
  selectedExclusions?: string[];
  selectedSideDish?: string;
}

interface CartState {
  items: OrderItem[];
  addItem: (menuItem: MenuItem, selectedSize?: PizzaSize, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string, selectedExclusions?: string[], selectedSideDish?: string) => void;
  removeItem: (id: number, selectedSize?: PizzaSize, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string, selectedExclusions?: string[], selectedSideDish?: string) => void;
  updateQuantity: (id: number, quantity: number, selectedSize?: PizzaSize, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string, selectedExclusions?: string[], selectedSideDish?: string) => void;
  clearCart: () => void;
}

// Helper function to create a unique key for cart items
const getItemKey = (menuItem: MenuItem, selectedSize?: PizzaSize, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string, selectedExclusions?: string[], selectedSideDish?: string) => {
  const sizeKey = selectedSize ? selectedSize.name : 'default';
  const ingredientsKey = selectedIngredients && selectedIngredients.length > 0
    ? selectedIngredients.sort().join(',')
    : 'none';
  const extrasKey = selectedExtras && selectedExtras.length > 0
    ? selectedExtras.sort().join(',')
    : 'none';
  const pastaTypeKey = selectedPastaType || 'none';
  const sauceKey = selectedSauce || 'none';
  const exclusionsKey = selectedExclusions && selectedExclusions.length > 0
    ? selectedExclusions.sort().join(',')
    : 'none';
  const sideDishKey = selectedSideDish || 'none';
  return `${menuItem.id}-${sizeKey}-${ingredientsKey}-${extrasKey}-${pastaTypeKey}-${sauceKey}-${exclusionsKey}-${sideDishKey}`;
};

// Helper function to find item in cart
const findItemIndex = (items: OrderItem[], menuItem: MenuItem, selectedSize?: PizzaSize, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string, selectedExclusions?: string[], selectedSideDish?: string) => {
  return items.findIndex(item => {
    const itemKey = getItemKey(item.menuItem, item.selectedSize, item.selectedIngredients, item.selectedExtras, item.selectedPastaType, item.selectedSauce, item.selectedExclusions, item.selectedSideDish);
    const searchKey = getItemKey(menuItem, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish);
    return itemKey === searchKey;
  });
};

export const useCartStore = create<CartState>()(
  persist(
    set => ({
      items: [],

      addItem: (menuItem, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish) =>
        set(state => {
          const currentItems = [...state.items];
          const existingItemIndex = findItemIndex(currentItems, menuItem, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish);

          if (existingItemIndex >= 0) {
            currentItems[existingItemIndex] = {
              ...currentItems[existingItemIndex],
              quantity: currentItems[existingItemIndex].quantity + 1
            };
          } else {
            currentItems.push({
              menuItem: menuItem,
              quantity: 1,
              selectedSize,
              selectedIngredients: selectedIngredients || [],
              selectedExtras: selectedExtras || [],
              selectedPastaType,
              selectedSauce,
              selectedExclusions: selectedExclusions || [],
              selectedSideDish
            });
          }

          return { items: currentItems };
        }),

      removeItem: (id, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish) =>
        set(state => ({
          items: state.items.filter(item => {
            const itemKey = getItemKey(item.menuItem, item.selectedSize, item.selectedIngredients, item.selectedExtras, item.selectedPastaType, item.selectedSauce, item.selectedExclusions, item.selectedSideDish);
            const searchKey = getItemKey({ id } as MenuItem, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish);
            return itemKey !== searchKey;
          })
        })),

      updateQuantity: (id, quantity, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish) =>
        set(state => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(item => {
                const itemKey = getItemKey(item.menuItem, item.selectedSize, item.selectedIngredients, item.selectedExtras, item.selectedPastaType, item.selectedSauce, item.selectedExclusions, item.selectedSideDish);
                const searchKey = getItemKey({ id } as MenuItem, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish);
                return itemKey !== searchKey;
              })
            };
          }

          return {
            items: state.items.map(item => {
              const itemKey = getItemKey(item.menuItem, item.selectedSize, item.selectedIngredients, item.selectedExtras, item.selectedPastaType, item.selectedSauce, item.selectedExclusions, item.selectedSideDish);
              const searchKey = getItemKey({ id } as MenuItem, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedExclusions, selectedSideDish);
              return itemKey === searchKey ? { ...item, quantity } : item;
            })
          };
        }),

      clearCart: () => set({ items: [] }),
      
      resetStore: () => set({ items: [] })
    }),
    { name: 'cart-storage' }
  )
);