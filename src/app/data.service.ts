import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post('/api/upload', formData);
  }

  loadFiles(): Observable<string[]> {
    return this.http.get<string[]>('/api/load-files');
  }

  loadVisualization(filename: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/visualize/${filename}`);
  }
}
