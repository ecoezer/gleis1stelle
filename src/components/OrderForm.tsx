import React, { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2, Plus, Minus, ShoppingCart, Clock, MapPin, Phone, User, MessageSquare, Send } from 'lucide-react';
import { saveOrder } from '../services/orderService';

interface OrderItem {
  menuItem: {
    id: number;
    name: string;
    price: number;
    number: string | number;
  };
  quantity: number;
  selectedSize?: {
    name: string;
    description?: string;
  };
  selectedIngredients?: string[];
  selectedExtras?: string[];
  selectedPastaType?: string;
  selectedSauce?: string;
  selectedExclusions?: string[];
  selectedSideDish?: string;
}

interface OrderFormProps {
  orderItems: OrderItem[];
  onRemoveItem: (id: number, selectedSize?: any, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string, selectedExclusions?: string[], selectedSideDish?: string) => void;
  onUpdateQuantity: (id: number, quantity: number, selectedSize?: any, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string, selectedExclusions?: string[], selectedSideDish?: string) => void;
  onClearCart: () => void;
  onCloseMobileCart?: () => void;
  hideTitle?: boolean;
}

// Delivery zones with minimum order and delivery fee
const DELIVERY_ZONES = {
  'lutter': { label: 'Lutter am Barenberge', minOrder: 0, fee: 0 },
  'banteln': { label: 'Banteln', minOrder: 25, fee: 2.5 },
  'barfelde': { label: 'Barfelde', minOrder: 20, fee: 2.5 },
  'betheln': { label: 'Betheln', minOrder: 25, fee: 3 },
  'brueggen': { label: 'Brüggen', minOrder: 35, fee: 3 },
  'deinsen': { label: 'Deinsen', minOrder: 35, fee: 4 },
  'duingen': { label: 'Duingen', minOrder: 40, fee: 4 },
  'dunsen-gime': { label: 'Dunsen (Gime)', minOrder: 30, fee: 3 },
  'eime': { label: 'Eime', minOrder: 25, fee: 3 },
  'eitzum': { label: 'Eitzum', minOrder: 25, fee: 3 },
  'elze': { label: 'Elze', minOrder: 35, fee: 4 },
  'gronau': { label: 'Gronau', minOrder: 15, fee: 1.5 },
  'gronau-doetzum': { label: 'Gronau Dötzum', minOrder: 20, fee: 2 },
  'gronau-eddighausen': { label: 'Gronau Eddighausen', minOrder: 20, fee: 2.5 },
  'haus-escherde': { label: 'Haus Escherde', minOrder: 25, fee: 3 },
  'heinum': { label: 'Heinum', minOrder: 25, fee: 3 },
  'kolonie-godenau': { label: 'Kolonie Godenau', minOrder: 40, fee: 4 },
  'mehle-elze': { label: 'Mehle (Elze)', minOrder: 35, fee: 4 },
  'nienstedt': { label: 'Nienstedt', minOrder: 35, fee: 4 },
  'nordstemmen': { label: 'Nordstemmen', minOrder: 35, fee: 4 },
  'rheden-elze': { label: 'Rheden (Elze)', minOrder: 25, fee: 3 },
  'sibesse': { label: 'Sibesse', minOrder: 40, fee: 4 },
  'sorsum-elze': { label: 'Sorsum (Elze)', minOrder: 35, fee: 4 },
  'wallensted': { label: 'Wallensted', minOrder: 25, fee: 3 }
} as const;

// Form validation schema
const orderSchema = z.object({
  orderType: z.enum(['pickup', 'delivery']),
  deliveryZone: z.string().optional(),
  deliveryTime: z.enum(['asap', 'specific']),
  specificTime: z.string().optional(),
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  phone: z.string().min(10, 'Telefonnummer muss mindestens 10 Zeichen haben'),
  street: z.string().optional(),
  houseNumber: z.string().optional(),
  postcode: z.string().optional(),
  note: z.string().optional(),
}).refine((data) => {
  if (data.orderType === 'delivery') {
    return data.deliveryZone && data.street && data.houseNumber && data.postcode;
  }
  return true;
}, {
  message: 'Bei Lieferung sind Liefergebiet, Straße, Hausnummer und PLZ erforderlich',
  path: ['deliveryZone']
}).refine((data) => {
  if (data.deliveryTime === 'specific') {
    return data.specificTime;
  }
  return true;
}, {
  message: 'Bei spezifischer Zeit muss eine Uhrzeit angegeben werden',
  path: ['specificTime']
});

type OrderFormData = z.infer<typeof orderSchema>;

const OrderForm: React.FC<OrderFormProps> = ({ 
  orderItems, 
  onRemoveItem, 
  onUpdateQuantity, 
  onClearCart,
  onCloseMobileCart,
  hideTitle = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderType: 'pickup',
      deliveryTime: 'asap'
    }
  });

  const watchOrderType = watch('orderType');
  const watchDeliveryZone = watch('deliveryZone');
  const watchDeliveryTime = watch('deliveryTime');

  // Helper function to calculate item price including extras
  const calculateItemPrice = useCallback((item: OrderItem) => {
    let basePrice = item.selectedSize ? item.selectedSize.price : item.menuItem.price;
    const extrasPrice = (item.selectedExtras?.length || 0) * 1.00;
    return basePrice + extrasPrice;
  }, []);

  // Calculate totals
  const { subtotal, deliveryFee, total, canOrder, minOrderMessage } = useMemo(() => {
    const subtotal = orderItems.reduce((sum, item) => {
      const itemPrice = calculateItemPrice(item);
      return sum + (itemPrice * item.quantity);
    }, 0);
    
    let deliveryFee = 0;
    let canOrder = true;
    let minOrderMessage = '';

    if (watchOrderType === 'delivery' && watchDeliveryZone) {
      const zone = DELIVERY_ZONES[watchDeliveryZone as keyof typeof DELIVERY_ZONES];
      if (zone) {
        deliveryFee = zone.fee;
        if (subtotal < zone.minOrder) {
          canOrder = false;
          minOrderMessage = `Mindestbestellwert für ${zone.label}: ${zone.minOrder.toFixed(2).replace('.', ',')} €`;
        }
      }
    }

    const total = subtotal + deliveryFee;

    return { subtotal, deliveryFee, total, canOrder, minOrderMessage };
  }, [orderItems, watchOrderType, watchDeliveryZone, calculateItemPrice]);

  // Generate WhatsApp message
  const generateWhatsAppMessage = useCallback((data: OrderFormData) => {
    let message = `🍕 *Neue Bestellung - by Ali und Mesut*\n\n`;
    
    // Customer info
    message += `👤 *Kunde:* ${data.name}\n`;
    message += `📞 *Telefon:* ${data.phone}\n`;
    message += `📦 *Art:* ${data.orderType === 'pickup' ? 'Abholung' : 'Lieferung'}\n`;
    
    if (data.orderType === 'delivery' && data.deliveryZone) {
      const zone = DELIVERY_ZONES[data.deliveryZone as keyof typeof DELIVERY_ZONES];
      message += `📍 *Adresse:* ${data.street} ${data.houseNumber}, ${data.postcode}\n`;
      message += `🗺️ *Gebiet:* ${zone?.label}\n`;
    }
    
    message += `⏰ *Zeit:* ${data.deliveryTime === 'asap' ? 'So schnell wie möglich' : `Um ${data.specificTime} Uhr`}\n\n`;
    
    // Order items
    message += `🛒 *Bestellung:*\n`;
    orderItems.forEach(item => {
      let itemText = `${item.quantity}x Nr. ${item.menuItem.number} ${item.menuItem.name}`;
      
      if (item.selectedSize) {
        itemText += ` (${item.selectedSize.name}${item.selectedSize.description ? ` - ${item.selectedSize.description}` : ''})`;
      }
      
      if (item.selectedPastaType) {
        itemText += ` - Nudelsorte: ${item.selectedPastaType}`;
      }
      
      if (item.selectedSauce) {
        itemText += ` - Soße: ${item.selectedSauce}`;
      }
      
      if (item.selectedExclusions && item.selectedExclusions.length > 0) {
        itemText += ` - Salat: ${item.selectedExclusions.join(', ')}`;
      }

      if (item.selectedSideDish) {
        itemText += ` - Beilage: ${item.selectedSideDish}`;
      }

      if (item.selectedIngredients && item.selectedIngredients.length > 0) {
        itemText += ` - Zutaten: ${item.selectedIngredients.join(', ')}`;
      }
      
      if (item.selectedExtras && item.selectedExtras.length > 0) {
        itemText += ` - Extras: ${item.selectedExtras.join(', ')} (+${(item.selectedExtras.length * 1.00).toFixed(2).replace('.', ',')}€)`;
      }
      
      const itemTotal = (calculateItemPrice(item) * item.quantity).toFixed(2).replace('.', ',');
      itemText += ` = ${itemTotal} €`;
      
      message += `• ${itemText}\n`;
    });
    
    // Totals
    message += `\n💰 *Zwischensumme:* ${subtotal.toFixed(2).replace('.', ',')} €\n`;
    
    if (deliveryFee > 0) {
      message += `🚗 *Liefergebühr:* ${deliveryFee.toFixed(2).replace('.', ',')} €\n`;
    }
    
    message += `💳 *Gesamtbetrag:* ${total.toFixed(2).replace('.', ',')} €\n`;
    
    if (data.note) {
      message += `\n📝 *Anmerkung:* ${data.note}`;
    }
    
    return encodeURIComponent(message);
  }, [orderItems, subtotal, deliveryFee, total]);

  // Send email notification
  const sendEmailNotification = async (data: OrderFormData) => {
    try {
      const emailData = {
        orderType: data.orderType,
        deliveryZone: data.deliveryZone,
        deliveryTime: data.deliveryTime,
        specificTime: data.specificTime,
        name: data.name,
        phone: data.phone,
        street: data.street,
        houseNumber: data.houseNumber,
        postcode: data.postcode,
        note: data.note,
        orderItems,
        subtotal,
        deliveryFee,
        total
      };

      const response = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        console.warn('Email notification failed, but continuing with WhatsApp order');
      }
    } catch (error) {
      console.warn('Email notification error:', error);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    if (!canOrder || orderItems.length === 0) return;

    setIsSubmitting(true);

    try {
      const deliveryAddress = data.orderType === 'delivery'
        ? `${data.street} ${data.houseNumber}, ${data.postcode}${data.deliveryZone ? ` (${DELIVERY_ZONES[data.deliveryZone as keyof typeof DELIVERY_ZONES]?.label})` : ''}`
        : 'Abholung';

      const orderData = {
        customer_name: data.name,
        customer_phone: data.phone,
        customer_email: null,
        delivery_address: deliveryAddress,
        items: orderItems.map(item => ({
          menuItemId: item.menuItem.id,
          menuItemNumber: item.menuItem.number,
          name: item.menuItem.name,
          quantity: item.quantity,
          basePrice: item.selectedSize ? item.selectedSize.price : item.menuItem.price,
          selectedSize: item.selectedSize || null,
          selectedIngredients: item.selectedIngredients || null,
          selectedExtras: item.selectedExtras || null,
          selectedPastaType: item.selectedPastaType || null,
          selectedSauce: item.selectedSauce || null,
          selectedExclusions: item.selectedExclusions || null,
          selectedSideDish: item.selectedSideDish || null,
          totalPrice: calculateItemPrice(item) * item.quantity
        })),
        total_amount: total,
        notes: [
          data.orderType === 'pickup' ? 'Abholung' : 'Lieferung',
          data.deliveryTime === 'asap' ? 'So schnell wie möglich' : `Um ${data.specificTime} Uhr`,
          data.note
        ].filter(Boolean).join(' | ')
      };

      // Save order to Firebase in background (don't block WhatsApp)
      saveOrder(orderData)
        .then(() => console.log('Order saved to Firebase successfully'))
        .catch(error => console.error('Error saving order to Firebase:', error));

      // Generate WhatsApp message
      const whatsappMessage = generateWhatsAppMessage(data);
      const whatsappUrl = `https://wa.me/+4915771459166?text=${whatsappMessage}`;

      // Open WhatsApp
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        try {
          const whatsappWindow = window.open(whatsappUrl, '_blank');
          if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
            window.location.href = whatsappUrl;
          }
        } catch (error) {
          console.error('Error opening WhatsApp:', error);
          window.location.href = whatsappUrl;
        }
      } else {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }

      // Clear cart and form after successful order
      setTimeout(() => {
        onClearCart();
        reset();
      }, 1000);

    } catch (error) {
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = useCallback((item: OrderItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(
        item.menuItem.id,
        item.selectedSize,
        item.selectedIngredients,
        item.selectedExtras,
        item.selectedPastaType,
        item.selectedSauce,
        item.selectedExclusions,
        item.selectedSideDish
      );
    } else {
      onUpdateQuantity(
        item.menuItem.id,
        newQuantity,
        item.selectedSize,
        item.selectedIngredients,
        item.selectedExtras,
        item.selectedPastaType,
        item.selectedSauce,
        item.selectedExclusions,
        item.selectedSideDish
      );
    }
  }, [onRemoveItem, onUpdateQuantity]);

  const handleRemoveItem = useCallback((item: OrderItem) => {
    onRemoveItem(
      item.menuItem.id,
      item.selectedSize,
      item.selectedIngredients,
      item.selectedExtras,
      item.selectedPastaType,
      item.selectedSauce,
      item.selectedExclusions,
      item.selectedSideDish
    );
  }, [onRemoveItem]);

  const handleClearCart = useCallback(() => {
    setIsClearing(true);

    // After 800ms, actually clear the cart
    setTimeout(() => {
      onClearCart();
      setIsClearing(false);

      // Close mobile cart if the callback is provided
      if (onCloseMobileCart) {
        onCloseMobileCart();
      }
    }, 800);
  }, [onClearCart, onCloseMobileCart]);

  // Determine which items to show
  const shouldCollapse = orderItems.length > 2 && !hideTitle; // Only collapse on desktop (when hideTitle is false)
  const itemsToShow = shouldCollapse && !showAllItems ? orderItems.slice(0, 2) : orderItems;
  
  // Calculate total items count (including quantities)
  const totalItemsCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const visibleItemsCount = shouldCollapse && !showAllItems 
    ? itemsToShow.reduce((sum, item) => sum + item.quantity, 0)
    : totalItemsCount;
  const hiddenItemsCount = shouldCollapse && !showAllItems ? totalItemsCount - visibleItemsCount : 0;

  if (orderItems.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Ihr Warenkorb ist leer</h3>
        <p className="text-gray-600">Fügen Sie Artikel aus dem Menü hinzu, um eine Bestellung aufzugeben.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-0 transition-all duration-500 ${isClearing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {!hideTitle && (
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              Warenkorb
            </h2>
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className={`text-sm text-red-600 hover:text-red-700 font-medium transition-colors ${isClearing ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Warenkorb leeren"
            >
              {isClearing ? 'Wird geleert...' : 'Alles löschen'}
            </button>
          </div>
        </div>
      )}


      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {hideTitle && orderItems.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className={`text-sm text-red-600 hover:text-red-700 font-medium transition-colors ${isClearing ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Warenkorb leeren"
            >
              {isClearing ? 'Wird geleert...' : 'Alles löschen'}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {itemsToShow.map((item, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="space-y-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm leading-tight">
                    Nr. {item.menuItem.number} {item.menuItem.name}
                  </h4>
                </div>

                <div className="space-y-1.5">
                  {item.selectedSize && (
                    <div className="text-xs text-gray-600">
                      {item.selectedSize.name}{item.selectedSize.description && ` - ${item.selectedSize.description}`}
                    </div>
                  )}

                  {item.selectedPastaType && (
                    <div className="text-xs text-gray-600">
                      Pasta: {item.selectedPastaType}
                    </div>
                  )}

                  {item.selectedSauce && (
                    <div className="text-xs text-gray-600">
                      Sauce: {item.selectedSauce}
                    </div>
                  )}

                  {item.selectedExclusions && item.selectedExclusions.length > 0 && (
                    <div className="text-xs text-gray-600">
                      Salat: {item.selectedExclusions.join(', ')}
                    </div>
                  )}

                  {item.selectedSideDish && (
                    <div className="text-xs text-gray-600">
                      Beilage: {item.selectedSideDish}
                    </div>
                  )}

                  {item.selectedIngredients && item.selectedIngredients.length > 0 && (
                    <div className="text-xs text-gray-600">
                      Zutaten: {item.selectedIngredients.join(', ')}
                    </div>
                  )}

                  {item.selectedExtras && item.selectedExtras.length > 0 && (
                    <div className="text-xs text-gray-600">
                      Extras: {item.selectedExtras.join(', ')} (+{(item.selectedExtras.length * 1.00).toFixed(2)}€)
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="text-base font-semibold text-gray-900">
                    {(calculateItemPrice(item) * item.quantity).toFixed(2).replace('.', ',')} €
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>

                      <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>

                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {shouldCollapse && (
            <div className="text-center">
              <button
                onClick={() => setShowAllItems(!showAllItems)}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {showAllItems ? (
                  'Weniger anzeigen'
                ) : (
                  `Alle ${totalItemsCount} Artikel anzeigen (${hiddenItemsCount} weitere)`
                )}
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Zwischensumme</span>
            <span className="font-medium text-gray-900">{subtotal.toFixed(2).replace('.', ',')} €</span>
          </div>

          {deliveryFee > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Liefergebühr</span>
              <span className="font-medium text-gray-900">{deliveryFee.toFixed(2).replace('.', ',')} €</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Gesamt</span>
              <span className="text-lg font-semibold text-gray-900">
                {total.toFixed(2).replace('.', ',')} €
              </span>
            </div>
          </div>

          {!canOrder && minOrderMessage && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {minOrderMessage}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Bestellart
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 transition-all ${
                watchOrderType === 'pickup' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  value="pickup"
                  {...register('orderType')}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-gray-900">Abholung</span>
              </label>
              <label className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 transition-all ${
                watchOrderType === 'delivery' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  value="delivery"
                  {...register('orderType')}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-gray-900">Lieferung</span>
              </label>
            </div>
          </div>

          {watchOrderType === 'delivery' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Liefergebiet
              </label>
              <select
                {...register('deliveryZone')}
                className="w-full rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 p-2.5 text-sm bg-white"
              >
                <option value="">Bitte wählen...</option>
                {Object.entries(DELIVERY_ZONES).map(([key, zone]) => (
                  <option key={key} value={key}>
                    {zone.label} (Min. {zone.minOrder.toFixed(2).replace('.', ',')} €, +{zone.fee.toFixed(2).replace('.', ',')} € Liefergebühr)
                  </option>
                ))}
              </select>
              {errors.deliveryZone && (
                <p className="text-xs text-red-600">
                  {errors.deliveryZone.message}
                </p>
              )}
            </div>
          )}

          {watchOrderType === 'delivery' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Lieferadresse
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    {...register('street')}
                    className="w-full rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 p-2.5 text-sm bg-white"
                    placeholder="Straße"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    {...register('houseNumber')}
                    className="w-full rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 p-2.5 text-sm bg-white"
                    placeholder="Nr."
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    {...register('postcode')}
                    className="w-full rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 p-2.5 text-sm bg-white"
                    placeholder="Postleitzahl"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Lieferzeit
            </label>
            <div className="space-y-2">
              <label className={`flex items-center cursor-pointer p-3 rounded-lg border-2 transition-all ${
                watchDeliveryTime === 'asap' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  value="asap"
                  {...register('deliveryTime')}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-gray-900">So schnell wie möglich</span>
              </label>
              <label className={`flex items-center cursor-pointer p-3 rounded-lg border-2 transition-all ${
                watchDeliveryTime === 'specific' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  value="specific"
                  {...register('deliveryTime')}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-gray-900">Zu bestimmter Zeit</span>
              </label>
            </div>

            {watchDeliveryTime === 'specific' && (
              <div className="mt-2 space-y-1">
                <select
                  {...register('specificTime')}
                  className="w-full rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 p-2.5 text-sm bg-white"
                >
                  <option value="">Bitte wählen...</option>
                  {(() => {
                    const times = [];
                    const now = new Date();
                    const minTime = new Date(now.getTime() + 20 * 60 * 1000);
                    const isMonday = now.getDay() === 1;
                    const openingHour = isMonday ? 16 : 12;

                    let minutes = Math.ceil(minTime.getMinutes() / 5) * 5;
                    let hours = minTime.getHours();

                    if (minutes >= 60) {
                      minutes = 0;
                      hours++;
                    }

                    const startMinutes = hours * 60 + minutes;
                    const endMinutes = 22 * 60 + 30;

                    for (let totalMinutes = startMinutes; totalMinutes <= endMinutes; totalMinutes += 5) {
                      const h = Math.floor(totalMinutes / 60);
                      const m = totalMinutes % 60;

                      if (h < openingHour || h > 22 || (h === 22 && m > 30)) continue;

                      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                      times.push(timeStr);
                    }

                    return times.map(time => (
                      <option key={time} value={time}>{time} Uhr</option>
                    ));
                  })()}
                </select>
                <p className="text-xs text-gray-500">
                  Mindestens 20 Minuten im Voraus
                </p>
              </div>
            )}
            {errors.specificTime && (
              <p className="text-xs text-red-600">
                {errors.specificTime.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Name
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 p-2.5 text-sm bg-white"
                placeholder="Ihr Name"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Telefonnummer
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 p-2.5 text-sm bg-white"
                placeholder="0123 456789"
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Anmerkungen (optional)
              </label>
              <textarea
                {...register('note')}
                rows={3}
                className="w-full rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 p-2.5 text-sm bg-white resize-none"
                placeholder="Besondere Wünsche, Allergien, etc."
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!canOrder || orderItems.length === 0 || isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                canOrder && orderItems.length > 0 && !isSubmitting
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Wird gesendet...
                </>
              ) : (
                <>
                  Per WhatsApp bestellen
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* Bottom padding for mobile safe area */}
        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default OrderForm;