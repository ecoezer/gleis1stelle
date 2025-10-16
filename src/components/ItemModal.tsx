import React, { useState, useCallback } from 'react';
import { X, Plus, ShoppingCart, AlertTriangle, Info } from 'lucide-react';
import { MenuItem, PizzaSize } from '../types';
import {
  wunschPizzaIngredients, pizzaExtras, pastaTypes,
  sauceTypes, saladSauceTypes, pommesSauceTypes, beerTypes, saladExclusionOptions, sideDishOptions, drehspiessaSauceTypes, snackSauceTypes, pizzabroetchenSauceTypes
} from '../data/menuItems';
import { parseAllergens } from '../data/allergenData';

interface ItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
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
}

const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose, onAddToOrder }) => {
  const [selectedSize, setSelectedSize] = useState<PizzaSize | undefined>(
    item.sizes ? item.sizes[0] : undefined
  );
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedPastaType, setSelectedPastaType] = useState<string>(
    item.isPasta ? pastaTypes[0] : ''
  );
  const [selectedSauce, setSelectedSauce] = useState<string>('');
  const [selectedMeatType, setSelectedMeatType] = useState<string>(
    item.isMeatSelection ? 'Kalbfleisch' : ''
  );
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [selectedExclusions, setSelectedExclusions] = useState<string[]>([]);
  const [selectedSideDish, setSelectedSideDish] = useState<string>(
    item.number === 4 ? sideDishOptions[0] : ''
  );
  const [currentStep, setCurrentStep] = useState<'meat' | 'sauce' | 'exclusions' | 'sidedish' | 'complete'>('meat');
  const [showAllSauces, setShowAllSauces] = useState(false);
  const [showAllExclusions, setShowAllExclusions] = useState(false);
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  const [showAllergenPopup, setShowAllergenPopup] = useState(false);

  const handleIngredientToggle = useCallback((ingredient: string) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(i => i !== ingredient);
      } else if (prev.length < 4) {
        return [...prev, ingredient];
      }
      return prev;
    });
  }, []);

  const handleExtraToggle = useCallback((extra: string) => {
    setSelectedExtras(prev => 
      prev.includes(extra) 
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  }, []);

  const handleExclusionToggle = useCallback((exclusion: string) => {
    setSelectedExclusions(prev => 
      prev.includes(exclusion) 
        ? prev.filter(e => e !== exclusion)
        : [...prev, exclusion]
    );
  }, []);

  const handleSauceToggle = useCallback((sauce: string) => {
    setSelectedSauces(prev => {
      if (sauce === 'ohne Soße') {
        return prev.includes(sauce) ? [] : ['ohne Soße'];
      }

      const withoutOhneSose = prev.filter(s => s !== 'ohne Soße');

      if (withoutOhneSose.includes(sauce)) {
        return withoutOhneSose.filter(s => s !== sauce);
      }

      // For Drehspieß items, limit to 3 sauces
      if (item.isMeatSelection && withoutOhneSose.length >= 3) {
        return withoutOhneSose;
      }

      return [...withoutOhneSose, sauce];
    });
  }, [item.isMeatSelection]);

  const calculatePrice = useCallback(() => {
    let basePrice = selectedSize ? selectedSize.price : item.price;
    const extrasPrice = selectedExtras.length * 1.00;
    return basePrice + extrasPrice;
  }, [item.price, selectedSize, selectedExtras]);

  const handleAddToCart = useCallback(() => {
    // For meat selection items, check if we need to go to sauce selection step
    if (item.isMeatSelection && currentStep === 'meat') {
      setCurrentStep('sauce');
      return;
    }

    // For meat selection items, check if we need to go to exclusions step
    if (item.isMeatSelection && currentStep === 'sauce') {
      setCurrentStep('exclusions');
      return;
    }

    // For item #4 (Drehspieß Teller), check if we need to go to side dish selection step
    if (item.number === 4 && item.isMeatSelection && currentStep === 'exclusions') {
      setCurrentStep('sidedish');
      return;
    }

    // Show age warning popup for alcoholic items
    if ([593, 594].includes(item.id) && !showAgeWarning) {
      setShowAgeWarning(true);
      return;
    }

    onAddToOrder(
      item,
      selectedSize,
      selectedIngredients,
      selectedExtras,
      selectedPastaType || undefined,
      (selectedSauces.length > 0 ? selectedSauces.join(', ') : selectedSauce) || selectedMeatType || undefined,
      selectedExclusions,
      selectedSideDish || undefined
    );
    onClose();
  }, [item, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce, selectedSauces, selectedMeatType, selectedExclusions, selectedSideDish, onAddToOrder, onClose, currentStep, showAgeWarning]);

  const getSauceOptions = useCallback(() => {
    // Drehspieß items use special sauce types
    if (item.isMeatSelection) {
      return drehspiessaSauceTypes;
    }
    // Vegetarian dishes (74-79) use same sauce types as Drehspieß
    if ([74, 75, 76, 77, 78, 79].includes(item.number)) {
      return drehspiessaSauceTypes;
    }
    // Pizzabrötchen items (50-57) use pizzabrötchen sauce types
    if ([50, 51, 52, 53, 54, 55, 56, 57].includes(item.number)) {
      return pizzabroetchenSauceTypes;
    }
    // Snack items (16-20) use snack sauce types
    if ([16, 17, 18, 19, 20].includes(item.number)) {
      return snackSauceTypes;
    }
    if (item.id >= 564 && item.id <= 568 && item.isSpezialitaet) {
      return saladSauceTypes;
    }
    if ([8, 9, 10, 11, 12, 13, 14, 15].includes(item.number)) {
      return sauceTypes.filter(sauce => !['Tzatziki', 'Kräutersoße', 'Curry Sauce'].includes(sauce)).concat('Burger Sauce').sort();
    }
    return sauceTypes;
  }, [item.id, item.number, item.isSpezialitaet, item.isMeatSelection]);

  const getVisibleSauceOptions = useCallback(() => {
    const allSauces = getSauceOptions();
    if ((item.isMeatSelection && currentStep === 'sauce') || [6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57, 74, 75, 76, 77, 78, 79].includes(item.number)) {
      return showAllSauces ? allSauces : allSauces.slice(0, 3);
    }
    return allSauces;
  }, [getSauceOptions, item.isMeatSelection, item.number, currentStep, showAllSauces]);

  const getVisibleExclusionOptions = useCallback(() => {
    if (item.isMeatSelection && currentStep === 'exclusions') {
      return showAllExclusions ? saladExclusionOptions : saladExclusionOptions.slice(0, 3);
    }
    return saladExclusionOptions;
  }, [item.isMeatSelection, currentStep, showAllExclusions]);
  const handleBackToMeat = useCallback(() => {
    setCurrentStep('meat');
    setSelectedSauce(''); // Reset sauce selection when going back
  }, []);

  const handleBackToSauce = useCallback(() => {
    setCurrentStep('sauce');
    setSelectedExclusions([]); // Reset exclusions when going back
  }, []);

  const handleBackToExclusions = useCallback(() => {
    setCurrentStep('exclusions');
    setSelectedSideDish(sideDishOptions[0]); // Reset side dish when going back
  }, []);

  const getModalTitle = useCallback(() => {
    if (item.isMeatSelection) {
      if (currentStep === 'meat') {
        return 'Schritt 1: Fleischauswahl';
      } else if (currentStep === 'sauce') {
        return 'Schritt 2: Soßen wählen (mehrere möglich)';
      } else if (currentStep === 'exclusions') {
        return 'Schritt 3: Salat anpassen (mehrere möglich)';
      } else if (currentStep === 'sidedish') {
        return 'Schritt 4: Beilage wählen';
      }
    }
    return item.name;
  }, [item, currentStep]);

  const getButtonText = useCallback(() => {
    if (item.isMeatSelection && currentStep === 'meat') {
      return 'Weiter zur Soßenauswahl';
    } else if (item.isMeatSelection && currentStep === 'sauce') {
      return 'Weiter zur Salat-Anpassung';
    } else if (item.number === 4 && item.isMeatSelection && currentStep === 'exclusions') {
      return 'Weiter zur Beilagenauswahl';
    }
    return `Hinzufügen - ${calculatePrice().toFixed(2).replace('.', ',')} €`;
  }, [item, currentStep, calculatePrice]);

  if (!isOpen) return null;

  const allergenList = parseAllergens(item.allergens);

  // Allergen Info Popup
  if (showAllergenPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-orange-500 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Info className="w-6 h-6" />
              Allergene & Zusatzstoffe
            </h2>
            <button
              onClick={() => setShowAllergenPopup(false)}
              className="p-2 hover:bg-orange-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.name}</h3>
              {item.description && (
                <p className="text-gray-600 text-sm">{item.description}</p>
              )}
            </div>

            {allergenList.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Dieses Produkt enthält:</h4>
                <div className="space-y-2">
                  {allergenList.map((allergen, index) => (
                    <div
                      key={index}
                      className="bg-orange-50 border border-orange-200 rounded-lg p-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-orange-600 flex-shrink-0">
                          ({allergen.code})
                        </span>
                        <span className="text-gray-800 text-sm leading-relaxed">
                          {allergen.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-600">Keine Allergeninformationen verfügbar</p>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => setShowAllergenPopup(false)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Age verification warning modal
  if (showAgeWarning) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  {item.name}
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-900 text-white">
                    18+
                  </span>
                </h2>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-gray-800 font-medium">
                Dies ist ein Artikel mit Altersbeschränkung.
              </p>
              <p className="text-gray-700 mt-2">
                Dein/e Fahrer:in wird deinen gültigen Lichtbildausweis überprüfen.
              </p>
            </div>

            <div className="text-2xl font-bold text-gray-900 mb-4">
              {item.price.toFixed(2).replace('.', ',')} €
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-900 mb-1">Produktinfo</p>
              <p className="text-sm text-gray-600">
                {item.description ? item.description : `4,8% vol, 0,33l, ${(item.price / 0.33).toFixed(2).replace('.', ',')} €/1l`}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAgeWarning(false);
                  onClose();
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors border border-gray-300"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  onAddToOrder(
                    item,
                    selectedSize,
                    selectedIngredients,
                    selectedExtras,
                    selectedPastaType || undefined,
                    (selectedSauces.length > 0 ? selectedSauces.join(', ') : selectedSauce) || selectedMeatType || undefined,
                    selectedExclusions,
                    selectedSideDish || undefined
                  );
                  setShowAgeWarning(false);
                  onClose();
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Hinzufügen
                <span className="font-bold">{item.price.toFixed(2).replace('.', ',')} €</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-orange-500 text-white p-3 rounded-t-xl flex justify-between items-center">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              {getModalTitle()}
              {[593, 594].includes(item.id) && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-gray-900">
                  18+
                </span>
              )}
            </h2>
            {currentStep === 'meat' && item.description && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">{item.description}</p>
            )}
            {currentStep === 'sauce' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nr. {item.number} {item.name}
              </p>
            )}
            {currentStep === 'exclusions' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                mit {selectedSauces.length > 0 ? selectedSauces.join(', ') : 'ohne Soße'} - Nr. {item.number} {item.name}
              </p>
            )}
            {currentStep === 'sidedish' && (
              <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                mit {selectedSauces.length > 0 ? selectedSauces.join(', ') : 'ohne Soße'} - Nr. {item.number} {item.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {item.isMeatSelection && (currentStep === 'sauce' || currentStep === 'exclusions' || currentStep === 'sidedish') && (
              <button
                onClick={currentStep === 'sauce' ? handleBackToMeat : currentStep === 'exclusions' ? handleBackToSauce : handleBackToExclusions}
                className="p-2 hover:bg-orange-600 rounded-full transition-colors"
                title={currentStep === 'sauce' ? "Zurück zur Fleischauswahl" : currentStep === 'exclusions' ? "Zurück zur Soßenauswahl" : "Zurück zur Salat-Anpassung"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <button
            onClick={onClose}
            className="p-2 hover:bg-orange-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Allergen Information Banner */}
          {item.allergens && allergenList.length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-2">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium mb-0.5 text-sm">
                    Allergene: {item.allergens}
                  </p>
                  <button
                    onClick={() => setShowAllergenPopup(true)}
                    className="text-blue-600 hover:text-blue-700 font-semibold underline text-sm"
                  >
                    Hier klicken für Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Age Restriction Warning for Alcoholic Drinks */}
          {[593, 594].includes(item.id) && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-800 font-medium">
                    Dies ist ein Artikel mit Altersbeschränkung.
                  </p>
                  <p className="text-gray-700 mt-1">
                    Dein/e Fahrer:in wird deinen gültigen Lichtbildausweis überprüfen.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Price Display for Alcoholic Items */}
          {[593, 594].includes(item.id) && (
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {item.price.toFixed(2).replace('.', ',')} €
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">Produktinfo</p>
                <p>4,8% vol, 0,33l, {(item.price / 0.33).toFixed(2).replace('.', ',')} €/1l</p>
              </div>
            </div>
          )}

          {/* Step indicator for meat selection items */}
          {item.isMeatSelection && (
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
              <div className={`flex items-center space-x-1 ${currentStep === 'meat' ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'meat' ? 'bg-orange-500 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Fleisch</span>
                <span className="text-xs font-medium sm:hidden">F</span>
              </div>
              <div className={`w-4 h-px ${currentStep === 'sauce' || currentStep === 'exclusions' || currentStep === 'sidedish' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center space-x-1 ${currentStep === 'sauce' ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'sauce' ? 'bg-orange-500 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Soße</span>
                <span className="text-xs font-medium sm:hidden">S</span>
              </div>
              <div className={`w-4 h-px ${currentStep === 'exclusions' || currentStep === 'sidedish' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center space-x-1 ${currentStep === 'exclusions' ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === 'exclusions' ? 'bg-orange-500 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Salat</span>
                <span className="text-xs font-medium sm:hidden">Sa</span>
              </div>
              {item.number === 4 && (
                <>
                  <div className={`w-4 h-px ${currentStep === 'sidedish' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                  <div className={`flex items-center space-x-1 ${currentStep === 'sidedish' ? 'text-orange-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                      currentStep === 'sidedish' ? 'bg-orange-500 text-white' : 'bg-gray-200'
                    }`}>
                      4
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Beilage</span>
                    <span className="text-xs font-medium sm:hidden">B</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Size Selection */}
          {item.sizes && (!item.isMeatSelection || (currentStep !== 'sauce' && currentStep !== 'exclusions')) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Größe wählen *</h3>
              <div className="space-y-2">
                {item.sizes.map((size) => (
                  <label
                    key={size.name}
                    className={`flex items-center justify-between p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSize?.name === size.name
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="size"
                        value={size.name}
                        checked={selectedSize?.name === size.name}
                        onChange={() => setSelectedSize(size)}
                        className="text-orange-500 focus:ring-orange-500 w-4 h-4"
                      />
                      <div>
                        <div className="font-medium">{size.name}</div>
                        {size.description && (
                          <div className="text-sm text-gray-600">{size.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="font-bold text-orange-600">
                      {size.price.toFixed(2).replace('.', ',')} €
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Wunsch Pizza Ingredients */}
          {item.isWunschPizza && (!item.isMeatSelection || (currentStep !== 'sauce' && currentStep !== 'exclusions')) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Zutaten wählen ({selectedIngredients.length}/4) *
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto ingredients-scroll">
                {wunschPizzaIngredients.map((ingredient) => (
                  <label
                    key={ingredient}
                    className={`flex items-center space-x-2 p-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                      selectedIngredients.includes(ingredient)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    } ${
                      !selectedIngredients.includes(ingredient) && selectedIngredients.length >= 4
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIngredients.includes(ingredient)}
                      onChange={() => handleIngredientToggle(ingredient)}
                      disabled={!selectedIngredients.includes(ingredient) && selectedIngredients.length >= 4}
                      className="text-orange-500 focus:ring-orange-500 w-4 h-4"
                    />
                    <span>{ingredient}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Pizza Extras */}
          {(item.isPizza || item.isWunschPizza) && (!item.isMeatSelection || (currentStep !== 'sauce' && currentStep !== 'exclusions')) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Extras (+1,00€ pro Extra)
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {pizzaExtras.map((extra) => (
                  <label
                    key={extra}
                    className={`flex items-center space-x-2 p-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                      selectedExtras.includes(extra)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(extra)}
                      onChange={() => handleExtraToggle(extra)}
                      className="text-orange-500 focus:ring-orange-500 w-4 h-4"
                    />
                    <span>{extra}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Pasta Type Selection */}
          {item.isPasta && (!item.isMeatSelection || (currentStep !== 'sauce' && currentStep !== 'exclusions')) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Nudelsorte wählen *</h3>
              <div className="space-y-2">
                {pastaTypes.map((pastaType) => (
                  <label
                    key={pastaType}
                    className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPastaType === pastaType
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pastaType"
                      value={pastaType}
                      checked={selectedPastaType === pastaType}
                      onChange={(e) => setSelectedPastaType(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="font-medium">{pastaType}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Meat Selection - Only show in step 1 - Now only Kalb */}
          {item.isMeatSelection && currentStep === 'meat' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Fleischauswahl</h3>
              <div className="p-4 rounded-lg border-2 border-orange-500 bg-orange-50">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Kalbfleisch</span>
                </div>
              </div>
            </div>
          )}

          {/* Sauce Selection */}
          {((item.isSpezialitaet && ![81, 82, 564, 565, 566, 567, 568].includes(item.id) && !item.isMeatSelection) ||
            (item.id >= 564 && item.id <= 568 && item.isSpezialitaet) ||
            (item.isMeatSelection && currentStep === 'sauce') ||
            [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57, 74, 75, 76, 77, 78, 79].includes(item.number)) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                {item.id >= 564 && item.id <= 568 ? 'Dressing wählen' : ((item.isMeatSelection && currentStep === 'sauce') || [74, 75, 76, 77, 78, 79].includes(item.number) ? 'Soßen wählen (max. 3)' : [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57].includes(item.number) ? 'Soße wählen' : 'Soße wählen')}
                {!item.isMeatSelection && ![8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57, 74, 75, 76, 77, 78, 79].includes(item.number) && ((item.isSpezialitaet && ![81, 82].includes(item.id)) || (item.id >= 564 && item.id <= 568)) ? ' *' : ''}
              </h3>

              {(item.isMeatSelection && currentStep === 'sauce') || [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57, 74, 75, 76, 77, 78, 79].includes(item.number) ? (
                // Multiple selection for meat selection items in step 2 and snack items
                <div className="space-y-2">
                  {getVisibleSauceOptions().map((sauce) => {
                    const isDisabled = (item.isMeatSelection || [74, 75, 76, 77, 78, 79].includes(item.number)) && !selectedSauces.includes(sauce) && selectedSauces.length >= 3;
                    return (
                      <label
                        key={sauce}
                        className={`flex items-center space-x-2 p-2 rounded-lg border-2 transition-all ${
                          selectedSauces.includes(sauce)
                            ? 'border-orange-500 bg-orange-50'
                            : isDisabled
                            ? 'border-gray-200 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-orange-300 cursor-pointer'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSauces.includes(sauce)}
                          onChange={() => handleSauceToggle(sauce)}
                          disabled={isDisabled}
                          className="text-orange-500 focus:ring-orange-500 w-4 h-4"
                        />
                        <span className="font-medium">{sauce}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                // Single selection for other items
                <div className="space-y-2">
                  {getVisibleSauceOptions().map((sauce) => (
                    <label
                      key={sauce}
                      className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedSauce === sauce
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sauce"
                        value={sauce}
                        checked={selectedSauce === sauce}
                        onChange={(e) => setSelectedSauce(e.target.value)}
                        className="text-orange-500 focus:ring-orange-500 w-4 h-4"
                      />
                      <span className="font-medium">{sauce}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {/* Show More/Less Button for Sauce Selection in Step 2 and Sucuk items */}
              {((item.isMeatSelection && currentStep === 'sauce') || [6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57, 74, 75, 76, 77, 78, 79].includes(item.number)) && getSauceOptions().length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllSauces(!showAllSauces)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    {showAllSauces ? (
                      <>
                        <span>Weniger anzeigen</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Mehr anzeigen ({getSauceOptions().length - 3} weitere)</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Beer Selection */}
          {item.isBeerSelection && (!item.isMeatSelection || (currentStep !== 'sauce' && currentStep !== 'exclusions')) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Bier wählen *</h3>
              <div className="space-y-2">
                {beerTypes.map((beer) => (
                  <label
                    key={beer}
                    className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSauce === beer
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="beer"
                      value={beer}
                      checked={selectedSauce === beer}
                      onChange={(e) => setSelectedSauce(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="font-medium">{beer}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Salad Exclusions - Only show in step 3 for meat selection items */}
          {item.isMeatSelection && currentStep === 'exclusions' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Salat anpassen (mehrere möglich, optional)</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Wählen Sie aus, was Sie nicht in Ihrem Salat möchten:</p>
              <div className="space-y-2">
                {getVisibleExclusionOptions().map((exclusion) => (
                  <label
                    key={exclusion}
                    className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedExclusions.includes(exclusion)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExclusions.includes(exclusion)}
                      onChange={() => handleExclusionToggle(exclusion)}
                      className="text-orange-500 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="font-medium">{exclusion}</span>
                  </label>
                ))}
              </div>
              
              {/* Show More/Less Button for Exclusions in Step 3 */}
              {item.isMeatSelection && currentStep === 'exclusions' && saladExclusionOptions.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllExclusions(!showAllExclusions)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    {showAllExclusions ? (
                      <>
                        <span>Weniger anzeigen</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Mehr anzeigen ({saladExclusionOptions.length - 3} weitere)</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Side Dish Selection - Only show in step 4 for item #4 */}
          {item.number === 4 && item.isMeatSelection && currentStep === 'sidedish' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Beilage wählen *</h3>
              <div className="space-y-2">
                {sideDishOptions.map((sideDish) => (
                  <label
                    key={sideDish}
                    className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSideDish === sideDish
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sideDish"
                      value={sideDish}
                      checked={selectedSideDish === sideDish}
                      onChange={(e) => setSelectedSideDish(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="font-medium">{sideDish}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t">
            {/* Buttons for Step 2, Step 3, and Step 4 - Side by side */}
            {item.isMeatSelection && (currentStep === 'sauce' || currentStep === 'exclusions' || currentStep === 'sidedish') ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={currentStep === 'sauce' ? handleBackToMeat : currentStep === 'exclusions' ? handleBackToSauce : handleBackToExclusions}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors border border-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Zurück
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {currentStep === 'sauce' || (currentStep === 'exclusions' && item.number === 4) ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Weiter
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Hinzufügen
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Single button for other cases */
              <button
                onClick={handleAddToCart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {item.isMeatSelection && currentStep === 'meat' ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {getButtonText()}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {getButtonText()}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;