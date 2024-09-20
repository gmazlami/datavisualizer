import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VisualizationComponent } from '../visualization/visualization.component';
import { CommonModule, NgFor } from '@angular/common';
import { DataService } from '../data.service';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.css'],
  standalone: true,
  imports: [VisualizationComponent, NgFor, CommonModule]
})
export class LoadDataComponent implements OnInit {
  files: string[] = [];
  data: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.dataService.listFiles().subscribe((fileList: FileList) => {
      console.log(fileList);
    });
  }

  onFileClick(index: number): void {
    // Navigate to the index page when a file is clicked
    //this.router.navigate(['/']);

  }


  
}
