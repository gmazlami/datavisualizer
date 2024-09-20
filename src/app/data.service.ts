import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



import { Observable } from 'rxjs';
import { UploadedFiles } from './filelist';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:5000/api'; // Base URL


  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  loadFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}load-files`);
  }
  listFiles(): Observable<UploadedFiles> {
    return this.http.get<UploadedFiles>(`${this.baseUrl}/files`);
  }

  downloadFile(filename: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/download-file/${filename}`);
  }
}
