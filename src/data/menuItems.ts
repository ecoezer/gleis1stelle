import { MenuItem } from '../types';

// Day-based special offers helpers
const today = new Date().getDay();
export const isRippchen = () => today === 3;   // Wednesday
export const isSchnitzelTag = () => today === 4; // Thursday

// Pizza sizes with prices and descriptions
export const pizzaSizes = [
  { name: 'Medium', price: 8.90, description: 'Ø ca. 26 cm' },
  { name: 'Large', price: 9.90, description: 'Ø ca. 30 cm' },
  { name: 'Family', price: 17.90, description: 'Ø ca. 40 cm' },
  { name: 'Mega', price: 26.90, description: 'Ø ca. 50 cm' }
] as const;

// Pasta types (simple string arrays)
export const pastaTypes = ['Spaghetti', 'Maccheroni'] as const;

// Sauce types grouped by use case
export const sauceTypes = [
  'Tzatziki', 'Chili-Sauce', 'Kräutersoße', 'Curry Sauce',
  'Ketchup', 'Mayonnaise', 'ohne Soße'
] as const;

export const saladSauceTypes = ['Joghurt', 'French', 'Essig/Öl'] as const;
export const pommesSauceTypes = ['Ketchup', 'Mayonnaise', 'ohne Soße'] as const;
export const beerTypes = ['Becks', 'Herrenhäuser'] as const;
export const meatTypes = ['mit Kalbfleisch'] as const;

// Drehspieß sauce options (max 3 selectable)
export const drehspiessaSauceTypes = ['Cocktail-Soße', 'scharfe Soße', 'Tzatziki', 'ohne Soße'] as const;

// Snack sauce options (same as Drehspieß + Ketchup & Mayo)
export const snackSauceTypes = ['Cocktail-Soße', 'scharfe Soße', 'Tzatziki', 'Ketchup', 'Mayonnaise', 'ohne Soße'] as const;

// Salad exclusion options for Drehspieß items
export const saladExclusionOptions = [
  'ohne Eisbergsalat',
  'ohne Zwiebel',
  'ohne Rotkohl',
  'ohne Tomaten',
  'ohne Gurken'
] as const;

// Side dish options for Drehspieß Teller
export const sideDishOptions = ['Pommes frites', 'Bulgur'] as const;

// Wunsch Pizza ingredients
export const wunschPizzaIngredients = [
  'Ananas', 'Artischocken', 'Barbecuesauce', 'Brokkoli', 'Champignons frisch',
  'Chili-Cheese-Soße', 'Edamer', 'Formfleisch-Vorderschinken', 'Gewürzgurken',
  'Gorgonzola', 'Gyros', 'Hirtenkäse', 'Hähnchenbrust', 'Jalapeños',
  'Knoblauchwurst', 'Mais', 'Milde Peperoni', 'Mozzarella', 'Oliven', 'Paprika',
  'Parmaputenschinken', 'Peperoni, scharf', 'Remoulade', 'Rindermett', 'Rindersalami',
  'Rucola', 'Röstzwiebeln', 'Sauce Hollandaise', 'Spiegelei', 'Spinat', 'Tomaten',
  'Würstchen', 'Zwiebeln', 'ohne Zutat'
] as const;

// Pizza extras (all price 1.00€)
export const pizzaExtras = [
  'Ananas', 'Brokkoli', 'Champignons frisch', 'Edamer', 'Gewürzgurken',
  'Hähnchenbrust', 'Jalapeños', 'Mais', 'Mozzarella', 'Oliven', 'Paprika',
  'Peperoni mild', 'Putenschinken', 'Rindersalami', 'Sauce Hollandaise', 'Spinat',
  'Sucuk', 'Tomaten', 'Zwiebeln'
] as const;

// Vegetarian dishes
export const vegetarischeGerichte: readonly MenuItem[] = [
  { id: 519, number: 19, name: "Zigaretten Börek", description: "knusprige Börek-Röllchen, gefüllt mit Käse", price: 1.00, allergens: "A1, G" },
  { id: 520, number: 20, name: "Halloumi-Tasche", description: "im Fladenbrot mit gegrilltem Halloumi, frischem Salat & Soße", price: 7.00, isSpezialitaet: true, allergens: "A1, G" },
  { id: 521, number: 21, name: "Halloumi-Dürüm", description: "im dünnen Fladenbrot mit gegrilltem Halloumi, frischem Salat & Soße", price: 8.00, isSpezialitaet: true, allergens: "A1, G" },
  { id: 522, number: 22, name: "Halloumi-Teller", description: "mit gegrilltem Halloumi, Bulgur oder Pommes, Salat & Soße", price: 13.50, isSpezialitaet: true, allergens: "A1, G" },
  { id: 523, number: 23, name: "Falafel-Tasche", description: "im Fladenbrot mit hausgemachten Falafel, gemischtem Salat & Soße", price: 7.00, isSpezialitaet: true, allergens: "A1, F" },
  { id: 524, number: 24, name: "Falafel-Dürüm", description: "im dünnen Fladenbrot mit Falafel, gemischtem Salat & Soße", price: 8.00, isSpezialitaet: true, allergens: "A1, F" },
  { id: 525, number: 25, name: "Falafel-Teller", description: "mit Bulgur oder Pommes frites, gemischtem Salat & Soße", price: 13.50, isSpezialitaet: true, allergens: "A1, F" }
];

// Croques
export const croques: readonly MenuItem[] = [
  { id: 548, number: 48, name: "Brokkoli Croque", description: "mit Broccoli, Zwiebeln, Paprika & Spinat", price: 8.00, allergens: "A1, 1" },
  { id: 549, number: 49, name: "Rindersalami Croque", description: "mit Rindersalami", price: 8.50, allergens: "A1, 1, C, G, 9, I" },
  { id: 550, number: 50, name: "Putenschinken Croque", description: "mit Putenschinken", price: 8.50, allergens: "A1, 1, G, 9, 9, I, 12" },
  { id: 551, number: 51, name: "Tonno Croque", description: "mit Thunfisch & Zwiebeln", price: 9.00, allergens: "A1, 1" },
  { id: 552, number: 52, name: "Hawaii Croque", description: "mit Putenschinken & Ananas", price: 9.00, allergens: "A1, 1, G, 9, 9, I, 12" },
  { id: 553, number: 53, name: "Feta Croque", description: "mit Weichkäse", price: 8.50, allergens: "A1, 1" },
  { id: 554, number: 54, name: "Mozzarella Croque", description: "mit Mozzarella & frischen Tomaten", price: 8.50, allergens: "A1, 1" },
  { id: 555, number: 55, name: "Sucuk Croque", description: "mit Knoblauchwurst", price: 9.00, allergens: "A1, 1, G, 4, 9, 3, 9, 12, 18" },
  { id: 556, number: 56, name: "Pute Croque", description: "mit gegrilltem Putenfleisch, Zwiebeln & Mozzarella", price: 9.00, allergens: "A1, 1" },
  { id: 557, number: 57, name: "Funghi Croque", description: "mit Champignons, Putenschinken & Weichkäse", price: 9.00, allergens: "A1, 1, G, 9, 9, I, 12" },
  { id: 558, number: 58, name: "Hamburger Croque", description: "mit Hamburger-Patty, Röstzwiebeln", price: 9.00, allergens: "A1, 1, G, I, 4, 3, I0" },
  { id: 559, number: 59, name: "Nuggets Croque", description: "mit Chicken-Nuggets & Paprika", price: 9.00, allergens: "A1, 1, 8, 9, I" },
  { id: 560, number: 60, name: "Jalapenos Croque", description: "mit Putenschinken, Rindersalami & Peperoni", price: 9.00, allergens: "A1, 1, G, 9, 9, I, 12" },
  { id: 561, number: 61, name: "Drehspieß Croque", description: "mit Drehspieß nach Wahl: Kalb oder Hähnchen", price: 9.00, allergens: "A1, 1, G, 4, 9, 3, 9, 12, 18" }
];

// Snacks
export const snacks: readonly MenuItem[] = [
  { id: 586, number: 16, name: "Pommes klein", description: "", price: 3.00, isSpezialitaet: true },
  { id: 586, number: 16, name: "Pommes groß", description: "", price: 4.50, isSpezialitaet: true },
  { id: 587, number: 17, name: "Chicken-Nuggets", description: "6 Stk.", price: 5.50, isSpezialitaet: true, allergens: "Ao, I, 8.2" },
  { id: 588, number: 18, name: "Chicken-Nuggets", description: "12 Stk.", price: 8.00, isSpezialitaet: true, allergens: "Ao, I, 8.2" },
  { id: 589, number: 19, name: "Loaded Fries mit Hackfleisch", description: "mit Pommes, Rinderhackfleisch, Sauce und Käse", price: 7.50, isSpezialitaet: true },
  { id: 590, number: 20, name: "Currywurst Pommes", description: "", price: 7.00, isSpezialitaet: true, allergens: "Ao, G, I, K, 6, 8.2, 9, 9.I, 17" }
];

// Salads
export const salads: readonly MenuItem[] = [
  { id: 562, number: 62, name: "Bauernsalat", description: "mit Eisbergsalat, Gurken, Tomaten und Zwiebeln", price: 7.00, isSpezialitaet: true },
  { id: 563, number: 63, name: "Hirtensalat", description: "mit Eisbergsalat, Gurken, Tomaten, Zwiebeln und Feta-Käse", price: 7.50, isSpezialitaet: true },
  { id: 564, number: 64, name: "Thunfischsalat", description: "mit Eisbergsalat, Gurken, Tomaten, Zwiebeln und Thunfisch", price: 8.50, isSpezialitaet: true },
  { id: 565, number: 65, name: "Hähnchenbrust-Salat", description: "mit Eisbergsalat, Gurken, Tomaten, Zwiebeln und gegrillter Hähnchenbrust", price: 9.00, isSpezialitaet: true },
  { id: 566, number: 66, name: "Mozzarella-Salat", description: "mit Eisbergsalat, Tomaten, frischem Mozzarella und Basilikum", price: 8.50, isSpezialitaet: true }
];

// Dips
export const dips: readonly MenuItem[] = [
  { id: 567, number: 67, name: "Tzatziki", description: "", price: 2.00 },
  { id: 568, number: 68, name: "Chili-Sauce", description: "", price: 2.00 },
  { id: 569, number: 69, name: "Kräutersoße", description: "", price: 2.00 },
  { id: 570, number: 70, name: "Curry Sauce", description: "", price: 2.00 },
  { id: 571, number: 71, name: "Ketchup", description: "", price: 1.00 },
  { id: 572, number: 72, name: "Mayonnaise", description: "", price: 1.00 }
];

// Drinks
export const drinks: readonly MenuItem[] = [
  { id: 100, name: "Coca-Cola", description: "0,33 L", price: 2.00 },
  { id: 101, name: "Coca-Cola Zero", description: "0,33 L", price: 2.00 },
  { id: 102, name: "Fanta Orange", description: "0,33 L", price: 2.00 },
  { id: 103, name: "Fanta Exotic", description: "0,33 L", price: 2.00 },
  { id: 104, name: "Sprite", description: "0,33 L", price: 2.00 },
  { id: 105, name: "Mezzo-mix", description: "0,33 L", price: 2.00 },
  { id: 106, name: "Apfelschorle", description: "0,33 L", price: 2.00 },
  { id: 107, name: "Eistee Pfirsich", description: "0,33 L", price: 2.00 },
  { id: 108, name: "Capri-Sonne", description: "0,20 L", price: 1.50 },
  { id: 109, name: "Ayran", description: "0,25 L", price: 1.50 },
  { id: 110, name: "Wasser", description: "0,33 L", price: 2.00 },
  { id: 111, name: "Bier", description: "0,33 L", price: 2.00 },
  { id: 112, name: "Alkoholfreies Bier", description: "0,33 L", price: 2.00 }
];

// Drehspieß (Meat dishes)
export const fleischgerichte: readonly MenuItem[] = [
  { id: 529, number: 1, name: "Drehspieß Tasche", description: "im Fladenbrot mit gemischtem Salat & Soße", price: 7.00, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 530, number: 2, name: "Drehspieß Dürüm", description: "Döner-Rolle mit gemischtem Salat & Soße", price: 8.00, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 531, number: 3, name: "Drehspieß Box", description: "mit Drehspießfleisch, Pommes frites & Soße", price: 8.50, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 532, number: 4, name: "Drehspieß Teller (mit Pommes)", description: "mit Drehspießfleisch, Pommes frites & Soße", price: 11.50, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 533, number: 5, name: "Drehspieß Teller (mit Salat)", description: "mit Drehspießfleisch, Salat & Soße", price: 11.50, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 534, number: 6, name: "Jalapeño Drehspieß Tasche", description: "im Fladenbrot mit gemischtem Salat, Sauce Hollandaise und Jalapeños", price: 7.50, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 535, number: 7, name: "Drehspieß Überbacken", description: "mit Sauce Hollandaise, Zwiebeln", price: 8.50, isSpezialitaet: true, isMeatSelection: true, allergens: "A1, G, 1, M, 14, 17, 18" },
  { id: 536, number: 6, name: "Lahmacun mit Salat", description: "Rolle mit gemischtem Salat & Soße", price: 6.50, isSpezialitaet: true, allergens: "A1" },
  { id: 537, number: 7, name: "Lahmacun Spezial", description: "Rolle mit gemischtem Salat, Weichkäse & Soße", price: 7.00, isSpezialitaet: true, allergens: "A1, G" }
];

// Pizza dishes
export const pizzas: readonly MenuItem[] = [
  { id: 526, number: 26, name: "Pizza Margherita", description: "", price: 9.00, isPizza: true, allergens: "A1, G" },
  { id: 527, number: 27, name: "Pizza Rindersalami", description: "mit Rindersalami", price: 10.00, isPizza: true, allergens: "A1, 1, C, G, 9, I" },
  { id: 528, number: 28, name: "Pizza Putenschinken", description: "mit Putenschinken", price: 10.00, isPizza: true, allergens: "A1, 1, G, 9, 9, I, 12" },
  { id: 529, number: 29, name: "Pizza Funghi", description: "mit Champignons", price: 10.00, isPizza: true, allergens: "A1, 1" },
  { id: 530, number: 30, name: "Pizza Tonno", description: "mit Thunfisch & Zwiebeln", price: 11.00, isPizza: true, allergens: "A1, 1" },
  { id: 531, number: 31, name: "Pizza Sucuk", description: "mit Knoblauchwurst", price: 11.00, isPizza: true, allergens: "A1, 1, G, 4, 9, 3, 9, 12, 18" },
  { id: 532, number: 32, name: "Pizza Hollandaise", description: "mit Hähnchenbrustfilet, Broccoli, Tomaten, Hollandaise-Soße", price: 12.00, isPizza: true, allergens: "A1, G, C, 3" },
  { id: 533, number: 33, name: "Pizza Hawaii", description: "mit Ananas & Putenschinken", price: 12.00, isPizza: true, allergens: "A1, 1, G, 9, 9, I, 12" },
  { id: 534, number: 34, name: "Pizza Athen", description: "mit Spinat & Weichkäse", price: 12.00, isPizza: true, allergens: "A1, 1" },
  { id: 535, number: 35, name: "Pizza Rio", description: "mit Sucuk, Weichkäse, Zwiebeln & Peperoni", price: 12.50, isPizza: true, allergens: "A1, 1, G, 4, 9, 3, 9, 14, 12, 18" },
  { id: 536, number: 36, name: "Calzone", description: "mit 3 Zutaten nach Wahl, jede extra Zutat +1 €", price: 12.00, isPizza: true, allergens: "A1, 1" },
  { id: 537, number: 37, name: "Pizza Art Drehspieß", description: "mit Drehspieß nach Wahl & Zwiebeln", price: 12.50, isPizza: true, allergens: "A1, G, 1a, 14, 12, 18" },
  { id: 538, number: 38, name: "Pizza Hamburger", description: "mit Hamburger-Patty, Salat, jede extra Zutat +1 €, Burgersoße", price: 12.00, isPizza: true, allergens: "A1, 1, C, 3" },
  { id: 539, number: 39, name: "Pizza Mozzarella", description: "mit frischem Mozzarella & Tomaten", price: 12.00, isPizza: true, allergens: "A1, 1" },
  { id: 540, number: 40, name: "Pizza Italia", description: "mit Rindersalami, Mozzarella & frischem Basilikum", price: 11.00, isPizza: true, allergens: "A1, 1, C, G, 9, I" },
  { id: 541, number: 41, name: "Pizza Rustica", description: "mit Putenschinken, Rindersalami & frischen Champignons", price: 11.00, isPizza: true, allergens: "A1, 1, C, 8, 9, I" },
  { id: 542, number: 42, name: "Pizza Grüne Oase", description: "mit Paprika, Tomaten, Broccoli & Champignons", price: 12.00, isPizza: true, allergens: "A1, 1" },
  { id: 543, number: 43, name: "Pizza Mexico", description: "mit Jalapenos, Hähnchenfleisch, Mais, Paprika & Champignons", price: 12.00, isPizza: true, allergens: "A1, 1, C, 3, 9, I" },
  { id: 544, number: 44, name: "Pizza Quattro Stagioni", description: "mit Putenschinken, Rindersalami, Champignons & Artischocken", price: 12.00, isPizza: true, allergens: "A1, 1, C, 8, 9, I" },
  { id: 545, number: 45, name: "Pizza India", description: "mit Putenschinken, Hähnchenbrustfilet, Ananas & Currysauce", price: 12.00, isPizza: true, allergens: "A1, 1, G, 9, 9, I, 12" },
  { id: 546, number: 46, name: "Pizza Diavolo", description: "mit Rindersalami, Champignons & Peperoni", price: 12.50, isPizza: true, allergens: "A1, 1, C, G, 9, I" },
  { id: 547, number: 47, name: "Pizza Brötchen", description: "jede extra Zutat +1 €", price: 5.00, isPizza: true, allergens: "A1, 1, G" }
];