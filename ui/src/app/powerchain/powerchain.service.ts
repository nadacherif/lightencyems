import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PowerchainService {
  private apiUrl1 = 'http://localhost:5000/buyers';
  private apiUrl2 = 'http://localhost:5000/sellers';
  private apiUrl3 = 'http://localhost:5000/transactions';
  private apiUrl4 = 'http://localhost:5000/users';

  constructor(private http: HttpClient) {}

  getBuyers(): Observable<any> {
    return this.http.get<any>(this.apiUrl1);
  }

  getSellers(): Observable<any> {
    return this.http.get<any>(this.apiUrl2);
  }

  getTransactions(): Observable<any> {
    return this.http.get<any>(this.apiUrl3);
  }

  getUserDataAndCharts(name: string): Observable<any> {
    const url = `${this.apiUrl3}/${name}`;
    return this.http.get<any>(url);
  }

  addBuyer(buyerData: any): Observable<any> {
    return this.http.post(this.apiUrl1, buyerData);
  }

  addSeller(sellerData: any): Observable<any> {
    return this.http.post(this.apiUrl2, sellerData);
  }

  addUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl4, userData);
  }
}
