export type CategoryDef = {
  name: string;
  subcategories: string[];
};

export const CATEGORIES: CategoryDef[] = [
  { name: 'Restaurants', subcategories: ['Restaurant', 'Fast Food', 'Fine Dining', 'Family Restaurant', 'Cafe', 'Bakery', 'Other'] },
  { name: 'Retail', subcategories: ['Clothing Store', 'Electronics Store', 'Grocery Store', 'Book Store', 'Gift Shop', 'Supermarket', 'Other'] },
  { name: 'Hospitality', subcategories: ['Hotel', 'Resort', 'Guest House', 'Hostel', 'Homestay', 'Other'] },
  { name: 'Healthcare', subcategories: ['Dental Clinic', 'Clinic', 'Pharmacy', 'Hospital', 'Lab', 'Other'] },
  { name: 'Beauty', subcategories: ['Salon', 'Barber', 'Spa', 'Beauty Center', 'Nail Studio', 'Other'] },
  { name: 'Travel', subcategories: ['Travel Agency', 'Trekking Agency', 'Tour Operator', 'Adventure Company', 'Other'] },
  { name: 'Services', subcategories: ['Repair', 'Cleaning', 'Education', 'Professional Service', 'Gym', 'Other'] },
  { name: 'Automotive', subcategories: ['Workshop', 'Car Wash', 'Showroom', 'Other'] },
  { name: 'Education', subcategories: ['School', 'College', 'Tuition Center', 'Training Institute', 'Other'] },
];

export function getAllSubcategories() {
  return CATEGORIES.flatMap(c => c.subcategories.map(s => ({ category: c.name, subcategory: s })));
}

export function isValidCategory(cat: string) {
  return CATEGORIES.some(c => c.name === cat) || cat === 'Custom';
}
