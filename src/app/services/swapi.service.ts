import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private baseUrl = 'https://www.swapi.tech/api';

  constructor(private http: HttpClient) {}

  getRandomPerson(): Observable<any> {
    const randomId = Math.floor(Math.random() * 83) + 1;
    return this.http.get(`${this.baseUrl}/people/${randomId}`);
  }

  getRandomStarship(): Observable<any> {
    const randomId = Math.floor(Math.random() * 25) + 1;
    return this.http.get(`${this.baseUrl}/starships/${randomId}`);
  }
}