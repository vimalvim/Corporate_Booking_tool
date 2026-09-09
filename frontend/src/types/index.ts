export type Role = 'EMPLOYEE' | 'MANAGER' | 'FINANCE' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  employee_code: string;
  department: string;
  manager: number | null;
  manager_name?: string;
  is_active_employee: boolean;
  date_joined: string;
}

export type BookingStatus =
  | 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'BOOKED' | 'CANCELLED';

export type ItemType = 'FLIGHT' | 'HOTEL' | 'TRAIN' | 'CAB';

export interface BookingItem {
  id?: number;
  item_type: ItemType;
  provider: string;
  class_or_category: string;
  details: string;
  cost: string;
  quantity: number;
}

export interface Booking {
  id: number;
  reference: string;
  employee: number;
  employee_name: string;
  employee_code: string;
  department: string;
  trip_type: 'DOMESTIC' | 'INTERNATIONAL';
  purpose: string;
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  estimated_cost: string;
  is_policy_violation: boolean;
  policy_violation_details: string;
  deviation_justification: string;
  items: BookingItem[];
  approvals: Approval[];
  created_at: string;
  submitted_at: string | null;
  decided_at: string | null;
}

export interface Approval {
  id: number;
  booking: number;
  booking_reference: string;
  employee_name: string;
  estimated_cost: string;
  is_policy_violation: boolean;
  level: number;
  approver_role: string;
  approver: number | null;
  approver_name: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
  comments: string;
  acted_at: string | null;
  created_at: string;
}

export interface TravelPolicy {
  id: number;
  name: string;
  grade: string;
  trip_type: 'DOMESTIC' | 'INTERNATIONAL';
  max_flight_class: string;
  max_flight_fare: string;
  max_hotel_category_stars: number;
  max_hotel_price_per_night: string;
  max_train_class: string;
  advance_booking_days_required: number;
  is_active: boolean;
}

export interface DepartmentBudget {
  id: number;
  department: string;
  fiscal_year: string;
  allocated_amount: string;
  used_amount: string;
  remaining_amount: string;
  utilization_percent: number;
}

export interface ApprovalMatrixRule {
  id: number;
  level: number;
  min_amount: string;
  max_amount: string | null;
  approver_role: 'MANAGER' | 'FINANCE' | 'ADMIN';
  applies_to_violation_only: boolean;
  is_active: boolean;
}

export interface PaymentMethod {
  id: number;
  label: string;
  method_type: 'CORPORATE_CARD' | 'CASH_ADVANCE' | 'DIRECT_BILLING';
  masked_identifier: string;
  owner: number | null;
  owner_name?: string;
  department: string;
  is_active: boolean;
}

export interface Payment {
  id: number;
  booking: number;
  booking_reference: string;
  method: number;
  method_label: string;
  amount: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  transaction_ref: string;
  paid_at: string | null;
  created_at: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
