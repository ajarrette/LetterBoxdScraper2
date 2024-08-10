import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, forkJoin, map, Observable, switchMap } from 'rxjs';

export interface Film {
  id: string;
  link: string;
  name: string;
  rating: number;
  weightedRating: number;
  slug: string;
  views: number;
  year: number;
}

const modernWeight = 0.000000068;
const historicalWeight = 0.0000003;
const animationDiscount = true;

const annimationList: Record<string, boolean> = {
  'a-silent-voice': animationDiscount,
  aladdin: animationDiscount,
  akira: animationDiscount,
  'batman-mask-of-the-phantasm': animationDiscount,
  'beauty-and-the-beast-1991': animationDiscount,
  'castle-in-the-sky': animationDiscount,
  'coco-2017': animationDiscount,
  coraline: animationDiscount,
  'corpse-bride': animationDiscount,
  'fantastic-mr-fox': animationDiscount,
  'finding-nemo': animationDiscount,
  'ghost-in-the-shell': animationDiscount,
  'grave-of-the-fireflies': animationDiscount,
  'how-to-train-your-dragon': animationDiscount,
  'howls-moving-castle': animationDiscount,
  'inside-out-2015': animationDiscount,
  'inside-out-2-2024': animationDiscount,
  'isle-of-dogs-2018': animationDiscount,
  'kikis-delivery-service': animationDiscount,
  klaus: animationDiscount,
  'kung-fu-panda': animationDiscount,
  'lilo-stitch': animationDiscount,
  'lupin-the-third-the-castle-of-cagliostro': animationDiscount,
  'marcel-the-shell-with-shoes-on-2021': animationDiscount,
  'mary-and-max': animationDiscount,
  'monsters-inc': animationDiscount,
  mulan: animationDiscount,
  'my-neighbor-totoro': animationDiscount,
  'nausicaa-of-the-valley-of-the-wind': animationDiscount,
  'paddington-2': animationDiscount,
  'perfect-blue': animationDiscount,
  ponyo: animationDiscount,
  'porco-rosso': animationDiscount,
  'princess-mononoke': animationDiscount,
  'puss-in-boots-the-last-wish': animationDiscount,
  ratatouille: animationDiscount,
  'shrek-2': animationDiscount,
  shrek: animationDiscount,
  'soul-2020': animationDiscount,
  'spider-man-across-the-spider-verse': animationDiscount,
  'spider-man-into-the-spider-verse': animationDiscount,
  'spirited-away': animationDiscount,
  'spirit-stallion-of-the-cimarron': animationDiscount,
  'tangled-2010': animationDiscount,
  'the-hunchback-of-notre-dame-1996': animationDiscount,
  'the-incredibles': animationDiscount,
  'the-iron-giant': animationDiscount,
  'the-lion-king': animationDiscount,
  'the-many-adventures-of-winnie-the-pooh': animationDiscount,
  'the-mitchells-vs-the-machines': animationDiscount,
  'the-muppet-christmas-carol': animationDiscount,
  'the-muppet-movie': animationDiscount,
  'the-nightmare-before-christmas': animationDiscount,
  'the-princess-and-the-frog': animationDiscount,
  'the-secret-of-nimh': animationDiscount,
  'the-tale-of-the-princess-kaguya': animationDiscount,
  'the-wind-rises': animationDiscount,
  'tokyo-godfathers': animationDiscount,
  'toy-story': animationDiscount,
  'toy-story-2': animationDiscount,
  'toy-story-3': animationDiscount,
  'toy-story-4': animationDiscount,
  up: animationDiscount,
  walle: animationDiscount,
  'your-name': animationDiscount,
};

const defaultPopularityThreshold = 200000;

const popularityDictionary: Record<number, number> = {
  1920: 40000,
  1921: 40000,
  1922: 40000,
  1923: 40000,
  1924: 40000,
  1925: 45000,
  1926: 45000,
  1927: 45000,
  1928: 45000,
  1929: 45000,
  1930: 50000,
  1931: 50000,
  1932: 50000,
  1933: 50000,
  1934: 50000,
  1935: 50000,
  1936: 50000,
  1937: 50000,
  1938: 50000,
  1939: 50000,
  1940: 50000,
  1941: 50000,
  1942: 50000,
  1943: 50000,
  1944: 50000,
  1945: 50000,
  1946: 55000,
  1947: 55000,
  1948: 55000,
  1949: 55000,
  1950: 55000,
  1951: 55000,
  1952: 55000,
  1953: 55000,
  1954: 55000,
  1955: 55000,
  1956: 55000,
  1957: 55000,
  1958: 55000,
  1959: 55000,
  1960: 60000,
  1961: 60000,
  1962: 60000,
  1963: 60000,
  1964: 60000,
  1965: 65000,
  1966: 65000,
  1967: 65000,
  1968: 65000,
  1969: 65000,
  1970: 65000,
  1971: 70000,
  1972: 70000,
  1973: 70000,
  1974: 70000,
  1975: 70000,
  1976: 70000,
  1977: 70000,
  1978: 70000,
  1979: 70000,
  1980: 75000,
  1981: 75000,
  1982: 75000,
  1983: 75000,
  1984: 75000,
  1985: 90000,
  1986: 90000,
  1987: 90000,
  1988: 90000,
  1989: 90000,
  1990: 100000,
  1991: 100000,
  1992: 100000,
  1993: 100000,
  1994: 100000,
  1995: 100000,
  1996: 100000,
  1997: 100000,
  1998: 100000,
  1999: 100000,
  2000: 150000,
  2001: 150000,
  2002: 150000,
  2003: 150000,
  2004: 150000,
  2005: 150000,
  2006: 150000,
  2007: 150000,
  2008: 150000,
  2009: 150000,
  2019: 400000,
  2022: 400000,
  2023: 400000,
};

const ignoreList = new Set<string>([
  'a-charlie-brown-christmas', // TV movie
  'a-grand-day-out', // Short film
  'all-too-well-the-short-film', // Short film
  'baby-reindeer', // TV Show
  'band-of-brothers', // TV mini series
  'big-little-lies', // TV mini series
  'black-mirror-san-junipero', // TV show
  'black-mirror-shut-up-and-dance', // TV show
  'black-mirror-white-christmas', // TV show
  'bo-burnham-inside', // TV special
  'chernobyl', // TV mini series
  'cowboy-bebop', // TV show
  'dancer-in-the-dark',
  'death-note-2006', // TV show
  'demon-slayer-kimetsu-no-yaiba-the-movie-mugen-train', // Based on TV show
  'euphoria-fck-anyone-whos-not-a-sea-blob', // TV show
  'euphoria-trouble-dont-last-always', // TV show
  'free-solo', // Documentary
  'hamilton-2020', // Concert
  'the-haunting-2018', // TV mini series,
  'the-haunting-of-bly-manor', // TV mini series
  'jujutsu-kaisen-0',
  'koyaanisqatsi', // Photography with no plot
  'la-jetee', // Short film
  'man-with-a-movie-camera', // Documentary
  'meshes-of-the-afternoon', // Short film
  'michael-jacksons-thriller', // Music video,
  'mickeys-christmas-carol',
  'miss-americana', // Documentary
  'neon-genesis-evangelion', // TV show
  'neon-genesis-evangelion-the-end-of-evangelion', // TV movie
  'normal-people-2020', // TV mini series
  'over-the-garden-wall-2014', // TV mini series
  'paris-is-burning', // Documentary
  'persepolis', // Just because
  'pink-floyd-the-wall',
  'planet-earth-2006', // Documentary
  'the-queens-gambit', // TV mini series
  'stop-making-sense', // Concert
  'taylor-swift-the-eras-tour', // Concert
  'twin-peaks', // TV show
  'the-wrong-trousers', // Short film
  'vincent', // Short film
  'wallace-gromit-the-curse-of-the-were-rabbit', // Short film
]);

@Injectable({
  providedIn: 'root',
})
export class LetterboxdScraperService {
  private baseUrl = 'https://letterboxd.com';
  constructor(private http: HttpClient) {}

  getFilms(pageNumber: number = 1, year: number): Observable<Film[]> {
    const url = `${this.baseUrl}/films/ajax/year/${year}/by/rating/page/${pageNumber}/`;
    return this.http
      .get(url, {
        responseType: 'text',
      })
      .pipe(
        map((results) => {
          const movies = results.split('<li class="listitem poster-container"');
          movies.shift();
          return movies;
        }),
        map((movies: string[]) => {
          const letterboxdMovies: any[] = [];
          movies.forEach((filmHtml) => {
            const movieOverview = {
              id: this.getFilmId(filmHtml),
              link: this.getFilmLink(filmHtml),
              name: this.getFilmName(filmHtml),
              rating: this.getFilmRating(filmHtml),
              slug: this.getFilmSlug(filmHtml),
            };

            letterboxdMovies.push(movieOverview);
          });

          return letterboxdMovies;
        }),
        switchMap((films) => {
          const filmsStats: Observable<Film>[] = [];
          films.forEach((film) => {
            const stats$ = this.http
              .get(`https://letterboxd.com/csi/film/${film.slug}/stats/`, {
                responseType: 'text',
              })
              .pipe(
                map((statsHtml) => {
                  const views = this.getFilmViews(statsHtml);
                  return {
                    ...film,
                    views,
                    weightedRating: this.getWeightedFilmRating(
                      film.rating,
                      views,
                      film.slug,
                      film.year
                    ),
                  };
                })
              );
            filmsStats.push(stats$);
          });

          return forkJoin(filmsStats);
        }),
        switchMap((films) => {
          const filmsStats: Observable<Film>[] = [];
          films.forEach((film) => {
            const stats$ = this.http
              .get(
                `https://letterboxd.com/ajax/poster/film/${film.slug}/hero/230x345/`,
                {
                  responseType: 'text',
                }
              )
              .pipe(
                delay(500),
                map((html) => {
                  return { ...film, year: this.getFilmYear(html) };
                })
              );
            filmsStats.push(stats$);
          });

          return forkJoin(filmsStats);
        }),
        map((films) => {
          return films;
        }),
        map((films) => {
          return films.filter((film) => {
            const popularityThreshold =
              popularityDictionary[film.year] || defaultPopularityThreshold;
            return (
              film.views > popularityThreshold && !ignoreList.has(film.slug)
            );
          });
        })
      );
  }

  private getFilmId(filmHtml: string): string {
    return this.getSubString(filmHtml, 'data-film-id', 14);
  }

  private getFilmLink(filmHtml: string): string {
    return this.getSubString(filmHtml, 'data-target-link', 18);
  }

  private getFilmName(filmHtml: string): string {
    return this.getSubString(filmHtml, '" alt="', 7);
  }

  private getFilmRating(filmHtml: string): number {
    return +this.getSubString(filmHtml, '-rating=', 9);
  }

  private getWeightedFilmRating(
    rating: number,
    views: number,
    slug: string,
    year: number
  ): number {
    if (annimationList[slug]) {
      if (views < 500000) {
        return rating - 0.2;
      }
      return rating - 0.1;
    }

    const maxBonus = year >= 1975 ? 0.17 : 0.22;
    const weight = year >= 1975 ? modernWeight : historicalWeight;

    const weightChange = Math.min(maxBonus, views * weight);
    return rating + weightChange;
  }

  private getFilmSlug(filmHtml: string): string {
    return this.getSubString(filmHtml, 'data-film-slug', 16);
  }

  private getFilmViews(statsHtml: string): number {
    return +this.getSubString(statsHtml, 'Watched by ', 11, '&nbsp;').replace(
      /,/g,
      ''
    );
  }

  private getFilmYear(html: string): number {
    return +this.getSubString(html, 'release-year', 14);
  }

  private getSubString(
    filmHtml: string,
    key: string,
    offset: number,
    endingDelimiter = '"'
  ): string {
    let startIndex = filmHtml.indexOf(key);
    if (startIndex < 0) {
      return '';
    }

    startIndex += offset;
    const endIndex = filmHtml.indexOf(endingDelimiter, startIndex);
    return filmHtml.substring(startIndex, endIndex);
  }
}
