import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Film, LetterboxdScraperService } from './letterboxd-scraper.service';
import { BehaviorSubject, first } from 'rxjs';
import { FilmTableComponent } from './film-table/film-table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    FilmTableComponent,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private letterboxdService: LetterboxdScraperService) {}
  filmsSource = new BehaviorSubject<Film[]>([]);
  filteredFilmsSource = new BehaviorSubject<Film[]>([]);
  films$ = this.filteredFilmsSource.asObservable();
  page = 1;
  year = 1975;

  onGetFilms() {
    this.letterboxdService
      .getFilms(this.page++, +this.year)
      .pipe(first())
      .subscribe((newFilms) => {
        let updatedFilmList = newFilms.reduce((acc, curr) => {
          if (acc.findIndex((film) => film.id === curr.id) === -1) {
            acc.push(curr);
          }
          return acc;
        }, this.filmsSource.value.slice());

        const currentYearFilms = updatedFilmList.filter(
          (film) => film.year === this.year
        );
        updatedFilmList = updatedFilmList.filter(
          (film) => film.year !== this.year
        );
        currentYearFilms.sort((a, b) => b.weightedRating - a.weightedRating);

        const filteredFilmSource = this.filteredFilmsSource.value.filter(
          (film) => film.year !== this.year
        );
        this.filmsSource.next([...updatedFilmList, ...currentYearFilms]);
        this.filteredFilmsSource.next([
          ...filteredFilmSource,
          ...currentYearFilms.slice(0, 5),
        ]);
      });
  }

  setYear(year: number) {
    this.page = 1;
    this.year = +year;
  }
}
