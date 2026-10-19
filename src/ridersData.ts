export interface Rider {
    id: string;
    name: string;
    phone: string;
    status: 'Available' | 'On Delivery' | 'Offline';
    avatarColor: string; // Dynamic background colors for the UI
  }
  
  export const initialRiders: Rider[] = [
    { id: '1', name: 'Ramesh Kumar', phone: '+91 99630 88662', status: 'Available', avatarColor: '#FF5733' },
    { id: '2', name: 'Suresh Kumar', phone: '+91 98480 22334', status: 'On Delivery', avatarColor: '#33FF57' },
    { id: '3', name: 'Anil Kumar', phone: '+91 90000 11223', status: 'Offline', avatarColor: '#3357FF' }
  ];
  