import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from './api.config';

export interface SubListRequest {
  LTE_SUB: string;
  LTE_IMSI: string;
}

export interface GenericResultResponse {
  result: 'success' | 'failed';
  message: string;
}

export interface UserDetailsResponse {
  status: 'success' | 'failed';
  serviceOrders?: Array<{
    CIRT_TYPE: string;
    VOICE_SO: string;
    BB_SO: string;
    AB_SO: string;
  }>;
  workOrders?: {
    LTE_IMSI: string;
    LTE_ISDN: string;
    LTE_PROFILE: string;
    LTE_PKG: string;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LteApiService {
  constructor(private http: HttpClient) {}

  listUser(payload: SubListRequest): Observable<GenericResultResponse> {
    return this.http.post<GenericResultResponse>(API_ENDPOINTS.list, payload);
  }

  getUserDetails(payload: SubListRequest): Observable<UserDetailsResponse> {
    return this.http.post<UserDetailsResponse>(API_ENDPOINTS.details, payload);
  }

  createUser(payload: Record<string, string>): Observable<GenericResultResponse> {
    return this.http.post<GenericResultResponse>(API_ENDPOINTS.create, payload);
  }

  deleteUser(payload: Record<string, string>): Observable<GenericResultResponse> {
    return this.http.post<GenericResultResponse>(API_ENDPOINTS.delete, payload);
  }

  modifyUser(payload: { LTE_SUB: string; LTE_PKG: string }): Observable<GenericResultResponse> {
    return this.http.post<GenericResultResponse>(API_ENDPOINTS.modify, payload);
  }
}
