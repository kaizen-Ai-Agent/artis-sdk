// ─── Booking availability ───────────────────────────────────────────────────────────────────

export interface BookingAvailability {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  max_bookings: number;
  current_bookings: number;
  is_available: boolean;
}

// ─── Booking payloads ───────────────────────────────────────────────────────────────────

export interface CreateBookingPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  timeslot_id: number;
  consultation_type: string;
  notes?: string;
}

// ─── Booking responses ───────────────────────────────────────────────────────────────────

export interface CreateBookingResponse {
  message: string;
  booking_id: number;
}
