import React, { useState, useCallback, memo } from 'react';
import { Plus, ShoppingCart, ChefHat, Clock, Star } from 'lucide-react';
import { MenuItem, PizzaSize } from '../types';
import { 
  wunschPizzaIngredients, pizzaExtras, pastaTypes, 
  sauceTypes, saladSauceTypes, beerTypes, meatTypes 
} from '../data/menuItems';
import ItemModal from './ItemModal';

interface MenuSectionProps {
  title: string;
  description?: string;
  subTitle?: string;
  items: MenuItem[];
  bgColor?: string;
  onAddToOrder: (
    menuItem: MenuItem,
    selectedSize?: PizzaSize,
    selectedIngredients?: string[],
    selectedExtras?: string[],
    selectedPastaType?: string,
    selectedSauce?: string,
    selectedExclusions?: string[],
    selectedSideDish?: string
  ) => void;
  onModalStateChange?: (isOpen: boolean) => void;
}


const MenuSection: React.FC<MenuSectionProps> = ({ title, description, subTitle, items, bgColor = 'bg-orange-500', onAddToOrder, onModalStateChange }) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const today = new Date().getDay();

  const handleItemClick = useCallback((item: MenuItem) => {
    const needsConfig = item.sizes || item.isWunschPizza || item.isPizza || item.isPasta ||
                        item.isBeerSelection || item.isMeatSelection || (item.isSpezialitaet && ![81, 82, 580, 581, 582, 583].includes(item.id) && !item.isMeatSelection) ||
                        (item.id >= 564 && item.id <= 568 && item.isSpezialitaet) ||
                        [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57].includes(item.number) ||
                        [593, 594].includes(item.id); // Alcoholic drinks need age confirmation
    if (needsConfig) {
      setSelectedItem(item);
      onModalStateChange?.(true);
    } else {
      onAddToOrder(item);
    }
  }, [onAddToOrder, onModalStateChange]);

  const closeModal = useCallback(() => {
    setSelectedItem(null);
    onModalStateChange?.(false);
  }, [onModalStateChange]);

  if (!items.length) return null;

  return (
    <section className={`mb-6 ${title === 'Fleischgerichte' ? 'mt-8' : ''}`}>
      <header className={`${bgColor} text-white px-3 py-2 rounded-t-xl`}>
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5" />
          <h2 className="text-base font-bold">{title}</h2>
        </div>
        {description && <p className="text-xs opacity-90 leading-relaxed mt-1">{description}</p>}
        {subTitle && <p className="text-xs opacity-80 mt-0.5 italic">{subTitle}</p>}
      </header>

      <div className="bg-white rounded-b-xl shadow-lg overflow-hidden border border-gray-100">
        {items.map((item, i) => {
          const isRippchenSpecial = item.id === 84 && today === 3;
          const isSchnitzelSpecial = [546,547,548,549].includes(item.id) && today === 4;
          const hasSizes = item.sizes?.length > 0;
          const minPrice = hasSizes ? Math.min(...item.sizes!.map(s => s.price)) : item.price;
          const isLastItem = i === items.length - 1;

          return (
            <div
              key={`${item.id}-${i}`}
              className={`p-4 hover:bg-gray-50 transition flex justify-between items-center ${
                !isLastItem ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="w-9 h-9 bg-orange-100 text-orange-600 rounded-full flex justify-center items-center font-bold text-sm flex-shrink-0">
                  {item.number}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base font-bold ${isRippchenSpecial || isSchnitzelSpecial ? 'text-red-600' : 'text-gray-900'} flex items-center gap-2`}>
                    {item.name}
                    {[593, 594].includes(item.id) && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-900 text-white">
                        18+
                      </span>
                    )}
                  </h3>
                  {item.description && <p className="text-sm text-gray-600 mt-0.5 leading-snug">{item.description}</p>}
                  {item.allergens && <p className="text-xs text-gray-500 mt-1.5"><strong>Allergene:</strong> <span className="italic">{item.allergens}</span></p>}

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {isRippchenSpecial && <Badge color="red" icon={<Star className="w-3 h-3" />} text="🔥 RIPPCHEN-TAG SPEZIAL" />}
                    {isSchnitzelSpecial && <Badge color="red" icon={<Star className="w-3 h-3" />} text="🔥 SCHNITZEL-TAG SPEZIAL" />}
                    {hasSizes && <Badge color="blue" icon={<Star className="w-3 h-3" />} text="Größen verfügbar" />}
                    {item.isWunschPizza && <Badge color="purple" icon={<ChefHat className="w-3 h-3" />} text="4 Zutaten wählbar" />}
                    {(item.isPizza || item.isWunschPizza) && <Badge color="green" icon={<Plus className="w-3 h-3" />} text="Extras verfügbar" />}
                    {item.isPasta && <Badge color="yellow" icon={<Clock className="w-3 h-3" />} text="Nudelsorte wählbar" />}
                    {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57].includes(item.number) || (item.isSpezialitaet && ![81, 82, 580, 581, 582, 583].includes(item.id) && !item.isMeatSelection && !(item.id >= 564 && item.id <= 568))) && <Badge color="red" icon={<ChefHat className="w-3 h-3" />} text="Soße wählbar" />}
                    {item.id >= 564 && item.id <= 568 && item.isSpezialitaet && <Badge color="indigo" icon={<ChefHat className="w-3 h-3" />} text="Dressing wählbar" />}
                    {item.isBeerSelection && <Badge color="amber" icon={<ChefHat className="w-3 h-3" />} text="Bier wählbar" />}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-3">
                <div className="text-right">
                  {hasSizes ? (
                    <>
                      <div className="text-xs text-gray-600">ab</div>
                      <div className="text-lg font-bold text-orange-600">{minPrice.toFixed(2).replace('.', ',')} €</div>
                    </>
                  ) : (
                    <PriceDisplay item={item} specialRippchen={isRippchenSpecial} specialSchnitzel={isSchnitzelSpecial} />
                  )}
                </div>

                <button
                  onClick={() => handleItemClick(item)}
                  className="group relative flex items-center justify-center bg-orange-500 text-white w-10 h-10 rounded-full hover:bg-orange-600 transition-all transform hover:scale-110 shadow-md hover:shadow-xl"
                  aria-label="Hinzufügen"
                  title="Hinzufügen"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none">
                    Hinzufügen
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={closeModal}
          onAddToOrder={onAddToOrder}
        />
      )}
    </section>
  );
};

interface BadgeProps {
  color: 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'indigo' | 'amber';
  icon: React.ReactNode;
  text: string;
}

const Badge: React.FC<BadgeProps> = ({ color, icon, text }) => {
  const colors = {
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    amber: 'bg-amber-100 text-amber-800'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${colors[color]}`}>
      {icon} {text}
    </span>
  );
};

const PriceDisplay: React.FC<{ item: MenuItem; specialRippchen: boolean; specialSchnitzel: boolean }> = ({ item, specialRippchen, specialSchnitzel }) => {
  if (specialRippchen || specialSchnitzel) {
    const oldPrice = specialRippchen ? 14.90 : 12.90;
    return (
      <>
        <div className="text-xs text-gray-500 line-through">{oldPrice.toFixed(2).replace('.', ',')} €</div>
        <div className="text-lg text-red-600 font-bold animate-pulse">{item.price.toFixed(2).replace('.', ',')} €</div>
      </>
    );
  }
  return <div className="text-lg font-bold text-gray-900">{item.price.toFixed(2).replace('.', ',')} €</div>;
};

export default MenuSection;
