import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Film } from '../letterboxd-scraper.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-film-table',
  standalone: true,
  imports: [CommonModule, MatSort, MatSortModule, MatTableModule],
  templateUrl: './film-table.component.html',
  styleUrl: './film-table.component.scss',
})
export class FilmTableComponent {
  @ViewChild(MatSort) sort!: MatSort;
  @Input({ required: true }) set films(value: Film[]) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
  }
  dataSource!: MatTableDataSource<Film>;
  displayedColumns: string[] = [
    'name',
    'year',
    'views',
    'rating',
    'weightedRating',
  ];

  constructor() {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
