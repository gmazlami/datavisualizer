import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Import here

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:5000/api'; // Base URL


  uploadFile(formData: FormData): Observable<any> {
    return this.http.post('/api/upload', formData);
  }

  loadFiles(): Observable<string[]> {
    return this.http.get<string[]>('/api/load-files');
  }
  listFiles(): Observable<FileList> {
    return this.http.get<FileList>(`${this.baseUrl}/files`);
  }

  loadVisualization(filename: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/visualize/${filename}`);
  }
}
