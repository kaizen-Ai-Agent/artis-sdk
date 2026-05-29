import { HttpClient } from "../client.js";
import { ApiResponse } from "../types/common.js";
import {
  BookingAvailability,
  CreateBookingPayload,
  CreateBookingResponse,
} from "../types/booking.js";

export class BookingModule {
  constructor(private client: HttpClient) {}

  // GET /bookings/availability
  availability(): Promise<ApiResponse<BookingAvailability[]>> {
    return this.client.get<BookingAvailability[]>("/bookings/availability");
  }

  // POST /bookings
  create(
    payload: CreateBookingPayload,
  ): Promise<ApiResponse<CreateBookingResponse>> {
    return this.client.post<CreateBookingResponse>("/bookings", payload);
  }
}
