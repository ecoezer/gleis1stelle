import { collection, addDoc, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface OrderItem {
  menuItemId: number;
  menuItemNumber: string | number;
  name: string;
  quantity: number;
  basePrice: number;
  selectedSize?: { name: string; description?: string; price: number };
  selectedIngredients?: string[];
  selectedExtras?: string[];
  selectedPastaType?: string;
  selectedSauce?: string;
  selectedExclusions?: string[];
  selectedSideDish?: string;
  totalPrice: number;
}

export interface OrderData {
  id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  items: OrderItem[];
  total_amount: number;
  notes: string;
  created_at?: Timestamp | any;
}

export const saveOrder = async (orderData: Omit<OrderData, 'created_at'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      created_at: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

export const fetchOrders = async (): Promise<OrderData[]> => {
  try {
    const ordersQuery = query(collection(db, 'orders'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(ordersQuery);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as OrderData[];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};
