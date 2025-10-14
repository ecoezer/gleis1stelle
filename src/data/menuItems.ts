import { MenuItem } from '../types';

// Day-based special offers helpers
const today = new Date().getDay();
export const isRippchen = () => today === 3;   // Wednesday
export const isSchnitzelTag = () => today === 4; // Thursday

// Pizza sizes with prices and descriptions
export const pizzaSizes = [
  { name: 'ø28cm', price: 0, description: 'ø28cm' },
  { name: 'ø32cm', price: 3.00, description: 'ø32cm' },
  { name: 'ø40cm', price: 8.00, description: 'ø40cm' }
] as const;

// Pasta types (simple string arrays)
export const pastaTypes = ['Spaghetti', 'Maccheroni'] as const;

// Sauce types grouped by use case
export const sauceTypes = [
  'Tzatziki', 'Chili-Sauce', 'Kräutersoße', 'Curry Sauce',
  'Ketchup', 'Mayonnaise', 'ohne Soße'
] as const;

export const saladSauceTypes = ['Joghurt-Dressing', 'Balsamico-Dressing', 'Essig-Öl-Dressing'] as const;
export const pommesSauceTypes = ['Ketchup', 'Mayonnaise', 'ohne Soße'] as const;
export const beerTypes = ['Becks', 'Herrenhäuser'] as const;

// Drehspieß sauce options (max 3 selectable)
export const drehspiessaSauceTypes = ['Cocktail-Soße', 'scharfe Soße', 'Tzatziki', 'ohne Soße'] as const;

// Snack sauce options (same as Drehspieß + Ketchup & Mayo)
export const snackSauceTypes = ['Cocktail-Soße', 'scharfe Soße', 'Tzatziki', 'Ketchup', 'Mayonnaise', 'ohne Soße'] as const;

// Pizzabrötchen sauce options
export const pizzabroetchenSauceTypes = ['Joghurt', 'Kräuterremoulade', 'Chilicheese', 'Cocktail', 'Aioli', 'Tzatziki'] as const;

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
  { id: 574, number: 74, name: "Vegetarische Tasche", description: "mit frischem Salat, Tomaten, Gurken, Kraut und Sauce nach Wahl", price: 5.50, isSpezialitaet: true, allergens: "Aa, I" },
  { id: 575, number: 75, name: "Falafel Tasche", description: "mit Falafel, frischem Salat, Tomaten, Gurken, Kraut und Sauce nach Wahl", price: 6.00, isSpezialitaet: true, allergens: "Aa, E, G" },
  { id: 576, number: 76, name: "Falafel Dürüm (Rolle)", description: "mit Falafel, frischem Salat, Tomaten, Gurken, Kraut und Sauce nach Wahl", price: 6.50, isSpezialitaet: true, allergens: "Aa, E, G" },
  { id: 577, number: 77, name: "Falafel Teller", description: "mit Falafel, Pommes frites, frischem Salat und Sauce nach Wahl", price: 9.00, isSpezialitaet: true, allergens: "Aa, E, G" },
  { id: 578, number: 78, name: "Falafel Box", description: "mit Falafel, Pommes frites, frischem Salat und Sauce nach Wahl", price: 8.00, isSpezialitaet: true, allergens: "Aa, E, G" },
  { id: 579, number: 79, name: "Halloumi Tasche", description: "mit Halloumi, frischem Salat und Sauce nach Wahl", price: 7.50, isSpezialitaet: true, allergens: "Aa, I" }
];

// Pizzabrötchen
export const pizzabroetchen: readonly MenuItem[] = [
  { id: 550, number: 50, name: "Pizzabrötchen Classic", description: "", price: 7.00, allergens: "Aa, I" },
  { id: 551, number: 51, name: "Pizzabrötchen mit Käse", description: "", price: 8.00, allergens: "Aa, I" },
  { id: 552, number: 52, name: "Pizzabrötchen mit Thunfisch", description: "", price: 8.50, allergens: "Aa, F, I" },
  { id: 553, number: 53, name: "Pizzabrötchen mit Salami", description: "", price: 8.00, allergens: "Aa, B, I, G, 6, 9, 9.I" },
  { id: 554, number: 54, name: "Pizzabrötchen mit Schinken", description: "", price: 9.00, allergens: "Aa, B, I, G, 6, 9, 9.I, 17" },
  { id: 555, number: 55, name: "Pizzabrötchen mit Sucuk", description: "", price: 9.50, allergens: "Aa, B, G, I, M, 3, 6, 9, 14, 17, 18" },
  { id: 556, number: 56, name: "Pizzabrötchen mit Spinat", description: "", price: 9.50, allergens: "Aa, I" },
  { id: 557, number: 57, name: "Pizzabrötchen mit Kebab", description: "", price: 9.50, allergens: "Aa, G, I, M, 14, 17, 18" }
];

// Pide
export const pide: readonly MenuItem[] = [
  { id: 558, number: 58, name: "Käse Pide", description: "mit Gouda-Käse", price: 7.50, allergens: "Aa, I" },
  { id: 559, number: 59, name: "Hackfleisch Pide", description: "mit würzigem Hackfleisch, Zwiebeln und Tomaten", price: 8.50, allergens: "Aa, I" },
  { id: 560, number: 60, name: "Sucuk Pide", description: "mit würziger Knoblauchwurst, Zwiebeln und Tomaten", price: 8.50, allergens: "Aa, B, G, I, M, 3, 6, 9, 14, 17, 18" },
  { id: 561, number: 61, name: "Sucuk Pide mit Ei", description: "mit würziger Knoblauchwurst und Ei oben drauf", price: 9.00, allergens: "Aa, B, G, I, K, M, 3, 6, 9, 14, 17, 18" },
  { id: 562, number: 62, name: "Spinat Pide", description: "mit frischem Spinat und Hirtenkäse", price: 9.00, allergens: "Aa, I" },
  { id: 563, number: 63, name: "Drehspieß Pide", description: "mit Drehspießfleisch", price: 9.00, allergens: "Aa, G, I, M, 14, 17, 18" }
];

// Hamburger
export const croques: readonly MenuItem[] = [
  { id: 548, number: 8, name: "Crunchy Chicken Burger", description: "", price: 6.00, allergens: "Aa, I, 8.2" },
  { id: 549, number: 9, name: "Crunchy Chicken Cheeseburger", description: "mit Schmelzkäse", price: 6.50, allergens: "Aa, I, 8.2" },
  { id: 550, number: 10, name: "Hot Crunchy Chicken Burger", description: "mit Chilicheese, Jalapeños", price: 7.00, allergens: "Aa, I, 8.2" },
  { id: 551, number: 11, name: "Hamburger", description: "Rindfleisch-Patty", price: 6.00, allergens: "Aa, B, G" },
  { id: 552, number: 12, name: "Cheeseburger", description: "mit Schmelzkäse", price: 6.50, allergens: "Aa, B, G, I" },
  { id: 553, number: 13, name: "Bacon Burger", description: "mit Bacon", price: 7.00, allergens: "Aa, B, G" },
  { id: 554, number: 14, name: "BBQ Burger", description: "mit BBQ-Sauce & Bacon", price: 7.50, allergens: "Aa, B, G" },
  { id: 555, number: 15, name: "Steakhouse Burger Cheese", description: "mit BBQ-Sauce, Bacon, Röstzwiebeln", price: 7.50, allergens: "" }
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

// Schnitzel
export const schnitzel: readonly MenuItem[] = [
  { id: 580, number: 70, name: "Jäger Schnitzel", description: "mit Champignonsauce & Pommes", price: 11.50, isSpezialitaet: true, allergens: "1, 3, 8.2, 9, 14" },
  { id: 581, number: 71, name: "Wiener Art Schnitzel", description: "mit Zitrone", price: 11.50, isSpezialitaet: true },
  { id: 582, number: 72, name: "Zigeunerschnitzel", description: "mit Zigeunersauce", price: 11.50, isSpezialitaet: true, allergens: "1, 3, 8.2, 9, 14" },
  { id: 583, number: 73, name: "Sauce Hollandaise Schnitzel", description: "mit Sauce Hollandaise", price: 12.00, isSpezialitaet: true, allergens: "Aa, B, G, E, I, K, M, 3, 14, 17, 18" }
];

// Salads
export const salads: readonly MenuItem[] = [
  { id: 564, number: 64, name: "Bauernsalat", description: "mit Eisbergsalat, Gurken, Tomaten und Zwiebeln", price: 7.00, isSpezialitaet: true },
  { id: 565, number: 65, name: "Hirtensalat", description: "mit Eisbergsalat, Gurken, Tomaten, Zwiebeln und Feta-Käse", price: 7.00, isSpezialitaet: true, allergens: "I" },
  { id: 566, number: 66, name: "Thunfischsalat", description: "mit Eisbergsalat, Gurken, Tomaten, Zwiebeln und Thunfisch", price: 8.00, isSpezialitaet: true, allergens: "F" },
  { id: 567, number: 67, name: "Hähnchenbrustsalat", description: "mit Eisbergsalat, Gurken, Tomaten, Zwiebeln und gegrillter Hähnchenbrust", price: 8.50, isSpezialitaet: true },
  { id: 568, number: 68, name: "Mozzarella-Salat", description: "mit Eisbergsalat, Tomaten, frischem Mozzarella und Basilikum", price: 8.00, isSpezialitaet: true, allergens: "I" }
];

// Dips
export const dips: readonly MenuItem[] = [
  { id: 569, number: 69, name: "Tzatziki", description: "", price: 2.00 },
  { id: 570, number: 70, name: "Chili-Sauce", description: "", price: 2.00 },
  { id: 571, number: 71, name: "Kräutersoße", description: "", price: 2.00 },
  { id: 572, number: 72, name: "Curry Sauce", description: "", price: 2.00 },
  { id: 573, number: 73, name: "Ketchup", description: "", price: 1.00 },
  { id: 574, number: 74, name: "Mayonnaise", description: "", price: 1.00 }
];

// Alkoholfreie Getränke
export const alkoholfreieGetraenke: readonly MenuItem[] = [
  { id: 580, number: 80, name: "Coca Cola", description: "0,33l", price: 2.00, allergens: "3, 4, 18" },
  { id: 581, number: 81, name: "Coca Cola Zero", description: "0,33l", price: 2.00, allergens: "1, 3, 4, 13, 18" },
  { id: 582, number: 82, name: "Fanta", description: "0,33l", price: 2.00, allergens: "3, 6, 17, 18" },
  { id: 583, number: 83, name: "Fanta Exotic", description: "0,33l", price: 2.00, allergens: "1, 3, 13, 17, 18" },
  { id: 584, number: 84, name: "Sprite", description: "0,33l", price: 2.00, allergens: "18" },
  { id: 585, number: 85, name: "Mezzo Mix", description: "0,33l", price: 2.00, allergens: "3, 4, 17, 18" },
  { id: 586, number: 86, name: "Ayran", description: "0,25l", price: 2.00, allergens: "I" },
  { id: 587, number: 87, name: "Wasser", description: "0,5l", price: 1.50 },
  { id: 588, number: 88, name: "Coca Cola", description: "1,0l", price: 3.20, allergens: "3, 4, 18" },
  { id: 589, number: 89, name: "Coca Cola Zero", description: "1,0l", price: 3.20, allergens: "1, 3, 4, 13, 18" },
  { id: 590, number: 90, name: "Fanta", description: "1,0l", price: 3.20, allergens: "3, 6, 17, 18" },
  { id: 591, number: 91, name: "Sprite", description: "1,0l", price: 3.20, allergens: "18" },
  { id: 592, number: 92, name: "Mezzo Mix", description: "1,0l", price: 3.20, allergens: "3, 4, 17, 18" }
];

// Alkoholische Getränke
export const alkoholischeGetraenke: readonly MenuItem[] = [
  { id: 593, number: 93, name: "Becks Pils", description: "0,33l", price: 2.50, allergens: "Aa" },
  { id: 594, number: 94, name: "Einbecker Pils", description: "0,33l", price: 2.50, allergens: "Aa" }
];

// Drinks (kept for backward compatibility)
export const drinks: readonly MenuItem[] = [
  ...alkoholfreieGetraenke,
  ...alkoholischeGetraenke
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

// Pizza dishes - sizes: ø28cm, ø32cm, ø40cm
export const pizzas: readonly MenuItem[] = [
  { id: 521, number: 21, name: "Margherita", description: "", price: 7.00, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø28cm', price: 7.00, description: 'ø28cm' },
    { name: 'ø32cm', price: 10.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 15.00, description: 'ø40cm' }
  ]},
  { id: 522, number: 22, name: "Salami", description: "", price: 8.00, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", sizes: [
    { name: 'ø28cm', price: 8.00, description: 'ø28cm' },
    { name: 'ø32cm', price: 11.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 18.00, description: 'ø40cm' }
  ]},
  { id: 523, number: 23, name: "Schinken", description: "", price: 8.50, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", sizes: [
    { name: 'ø28cm', price: 8.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 11.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 18.00, description: 'ø40cm' }
  ]},
  { id: 524, number: 24, name: "Funghi", description: "mit Champignons", price: 8.00, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø28cm', price: 8.00, description: 'ø28cm' },
    { name: 'ø32cm', price: 11.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 17.00, description: 'ø40cm' }
  ]},
  { id: 525, number: 25, name: "Tonno", description: "mit Zwiebeln & Thunfisch", price: 9.00, isPizza: true, allergens: "Aa, E, I", sizes: [
    { name: 'ø28cm', price: 9.00, description: 'ø28cm' },
    { name: 'ø32cm', price: 12.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 18.00, description: 'ø40cm' }
  ]},
  { id: 526, number: 26, name: "Milano", description: "mit Salami & Pilzen", price: 9.50, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I", sizes: [
    { name: 'ø28cm', price: 9.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 12.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 18.50, description: 'ø40cm' }
  ]},
  { id: 527, number: 27, name: "Primavera", description: "mit Schinken & Pilzen", price: 9.50, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", sizes: [
    { name: 'ø28cm', price: 9.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 12.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 18.50, description: 'ø40cm' }
  ]},
  { id: 528, number: 28, name: "Hawaii", description: "mit Schinken & Ananas", price: 9.50, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", sizes: [
    { name: 'ø28cm', price: 9.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 12.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 18.50, description: 'ø40cm' }
  ]},
  { id: 529, number: 29, name: "Vegetarisch", description: "mit Spinat, Paprika-Mix, Pilzen, Mais", price: 9.50, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø28cm', price: 9.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 12.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 19.50, description: 'ø40cm' }
  ]},
  { id: 530, number: 30, name: "Chef Pizza", description: "mit Salami, Schinken, Paprika, Pilze", price: 10.50, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I, 17", sizes: [
    { name: 'ø28cm', price: 10.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 13.50, description: 'ø32cm' },
    { name: 'ø40cm', price: 22.00, description: 'ø40cm' }
  ]},
  { id: 531, number: 31, name: "Sucuk", description: "", price: 9.00, isPizza: true, allergens: "Aa, B, G, I, M, 3, 6, 9, 14, 17, 18", sizes: [
    { name: 'ø28cm', price: 9.00, description: 'ø28cm' },
    { name: 'ø32cm', price: 12.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 21.00, description: 'ø40cm' }
  ]},
  { id: 532, number: 32, name: "Sucuk Spezial", description: "mit Pilzen & Hollandaise", price: 10.00, isPizza: true, allergens: "Aa, B, G, E, I, K, M, 3, 6, 9, 14, 17, 18", sizes: [
    { name: 'ø28cm', price: 10.00, description: 'ø28cm' },
    { name: 'ø32cm', price: 13.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 22.00, description: 'ø40cm' }
  ]},
  { id: 533, number: 33, name: "Kebab Pizza", description: "mit Zwiebeln & Hollandaise", price: 10.00, isPizza: true, allergens: "Aa, B, G, E, I, K, M, 3, 6, 9, 14, 17, 18", sizes: [
    { name: 'ø28cm', price: 10.00, description: 'ø28cm' },
    { name: 'ø32cm', price: 13.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 22.00, description: 'ø40cm' }
  ]},
  { id: 534, number: 34, name: "Kebab Spezial", description: "", price: 10.50, isPizza: true, allergens: "Aa, G, I, M, 14, 17, 18", sizes: [
    { name: 'ø28cm', price: 10.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 14.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 23.00, description: 'ø40cm' }
  ]},
  { id: 535, number: 35, name: "Diavolo", description: "scharf, mit Salami & Jalapeños", price: 9.50, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I", sizes: [
    { name: 'ø28cm', price: 9.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 12.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 20.50, description: 'ø40cm' }
  ]},
  { id: 536, number: 36, name: "Baba Pizza", description: "mit Kebabfleisch, Brokkoli, Hollandaise", price: 10.00, isPizza: true, allergens: "Aa, B, G, E, I, K, M, 3, 14, 17, 18", sizes: [
    { name: 'ø28cm', price: 10.00, description: 'ø28cm' },
    { name: 'ø32cm', price: 13.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 23.00, description: 'ø40cm' }
  ]},
  { id: 537, number: 37, name: "Chicken Spezial", description: "mit Hähnchenbrust, Pilze, Peperoni, Hollandaise", price: 10.00, isPizza: true, allergens: "Aa, B, G, E, I, K, M, 3, 14, 17, 18", sizes: [
    { name: 'ø28cm', price: 10.00, description: 'ø28cm' },
    { name: 'ø32cm', price: 13.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 22.00, description: 'ø40cm' }
  ]},
  { id: 538, number: 38, name: "La Mama", description: "mit Spinat, Tomatenscheiben, Mozzarella", price: 9.50, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø28cm', price: 9.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 12.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 20.50, description: 'ø40cm' }
  ]},
  { id: 539, number: 39, name: "Mexico", description: "mit Hähnchenbrust, Brokkoli, Hollandaise", price: 10.00, isPizza: true, allergens: "Aa, B, G, E, I, K, M, 3, 14, 17, 18", sizes: [
    { name: 'ø28cm', price: 10.00, description: 'ø28cm' },
    { name: 'ø32cm', price: 13.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 22.00, description: 'ø40cm' }
  ]},
  { id: 540, number: 40, name: "Torino", description: "mit Salami, Tomatenscheiben, Mozzarella", price: 10.00, isPizza: true, allergens: "Aa, B, I, G, 6, 9, 9.I", sizes: [
    { name: 'ø28cm', price: 10.00, description: 'ø28cm' },
    { name: 'ø32cm', price: 13.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 22.00, description: 'ø40cm' }
  ]},
  { id: 541, number: 41, name: "Savona", description: "mit Spinat, Tomatenscheiben, Hirtenkäse", price: 10.00, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø28cm', price: 10.00, description: 'ø28cm' },
    { name: 'ø32cm', price: 13.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 22.00, description: 'ø40cm' }
  ]},
  { id: 542, number: 42, name: "BBQ Ranch", description: "mit BBQ, Salami, Bacon, Hackfleisch, Mozzarella", price: 12.50, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø28cm', price: 12.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 16.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 23.00, description: 'ø40cm' }
  ]},
  { id: 543, number: 43, name: "BBQ Pizza", description: "mit BBQ, Hackfleisch, Zwiebeln, Bacon, Mozzarella", price: 12.50, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø28cm', price: 12.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 16.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 23.00, description: 'ø40cm' }
  ]},
  { id: 544, number: 44, name: "New Orleans", description: "mit Hähnchenbrust, Bacon, Hackfleisch", price: 12.50, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø28cm', price: 12.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 16.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 23.00, description: 'ø40cm' }
  ]},
  { id: 545, number: 45, name: "Green Garden", description: "mit Zwiebeln, Mais, Paprika, Brokkoli, Oliven", price: 12.50, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø28cm', price: 12.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 16.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 22.50, description: 'ø40cm' }
  ]},
  { id: 546, number: 46, name: "Chicken & Curry", description: "mit Curry-Sauce, Ananas, Hähnchenbrust", price: 10.50, isPizza: true, allergens: "Aa, G, I, K, 6, 82, 9, 9.I, 17", sizes: [
    { name: 'ø28cm', price: 10.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 14.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 22.00, description: 'ø40cm' }
  ]},
  { id: 547, number: 47, name: "Chicken Supreme", description: "mit Hähnchenbrust, Spinat, Mozzarella", price: 10.50, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø28cm', price: 10.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 14.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 22.00, description: 'ø40cm' }
  ]},
  { id: 548, number: 48, name: "Pizza Gleis 1", description: "mit Hähnchenbrust, Hollandaise, Jalapeños", price: 12.50, isPizza: true, allergens: "Aa, B, G, E, I, K, M, 3, 14, 17, 18", sizes: [
    { name: 'ø28cm', price: 12.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 16.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 23.00, description: 'ø40cm' }
  ]},
  { id: 549, number: 49, name: "Margherita Deluxe", description: "mit Tomatenscheiben, Mozzarella", price: 10.50, isPizza: true, allergens: "Aa, I", sizes: [
    { name: 'ø28cm', price: 10.50, description: 'ø28cm' },
    { name: 'ø32cm', price: 14.00, description: 'ø32cm' },
    { name: 'ø40cm', price: 20.00, description: 'ø40cm' }
  ]}
];