// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      // Debug logging
      console.log(`🌐 API ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body as string) : '');
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error(`❌ API Error:`, data);
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
          message: data.message
        };
      }

      console.log(`✅ API Success:`, data);
      return {
        success: true,
        ...data
      };
    } catch (error: any) {
      console.error(`❌ Network Error:`, error);
      return {
        success: false,
        error: error.message || 'Cannot connect to server',
        message: 'Please check if backend is running'
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Get services
  async getServices(): Promise<ApiResponse> {
    return this.request('/services');
  }

  // Create booking
  async createBooking(bookingData: any): Promise<ApiResponse> {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Get available slots
  async getAvailableSlots(date: string): Promise<ApiResponse> {
    return this.request(`/bookings/slots/${date}`);
  }

  // Calculate price
  async calculatePrice(priceData: any): Promise<ApiResponse> {
    return this.request('/services/calculate-price', {
      method: 'POST',
      body: JSON.stringify(priceData),
    });
  }
}

export const apiService = new ApiService();