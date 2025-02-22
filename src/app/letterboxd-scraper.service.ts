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

interface Thresholds {
  maxBonus: number;
  views: number;
  weight: number;
}

const animationDiscount = true;

const annimationList: Record<string, boolean> = {
  'a-silent-voice': animationDiscount,
  'a-silent-voice-the-movie': animationDiscount,
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
  'look-back-2024': animationDiscount,
  'luca-2021': animationDiscount,
  'lupin-the-third-the-castle-of-cagliostro': animationDiscount,
  'marcel-the-shell-with-shoes-on-2021': animationDiscount,
  'mary-and-max': animationDiscount,
  'monsters-inc': animationDiscount,
  mulan: animationDiscount,
  'my-life-as-a-zucchini': animationDiscount,
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

const movieYear: Record<number, Thresholds> = {
  1900: { maxBonus: 0.22, weight: 0.00000022, views: 20000 },
  1901: { maxBonus: 0.22, weight: 0.00000022, views: 20000 },
  19031: { maxBonus: 0.22, weight: 0.00000022, views: 20000 },
  1903: { maxBonus: 0.22, weight: 0.00000022, views: 20000 },
  1904: { maxBonus: 0.22, weight: 0.00000022, views: 20000 },
  1905: { maxBonus: 0.22, weight: 0.00000022, views: 25000 },
  1906: { maxBonus: 0.22, weight: 0.00000022, views: 25000 },
  1907: { maxBonus: 0.22, weight: 0.00000022, views: 25000 },
  1908: { maxBonus: 0.22, weight: 0.00000022, views: 25000 },
  1909: { maxBonus: 0.22, weight: 0.00000022, views: 25000 },
  1910: { maxBonus: 0.22, weight: 0.00000022, views: 30000 },
  1911: { maxBonus: 0.22, weight: 0.00000022, views: 30000 },
  1912: { maxBonus: 0.22, weight: 0.00000022, views: 30000 },
  1913: { maxBonus: 0.22, weight: 0.00000022, views: 30000 },
  1914: { maxBonus: 0.22, weight: 0.00000022, views: 30000 },
  1915: { maxBonus: 0.22, weight: 0.00000022, views: 35000 },
  1916: { maxBonus: 0.22, weight: 0.00000022, views: 35000 },
  1917: { maxBonus: 0.22, weight: 0.00000022, views: 35000 },
  1918: { maxBonus: 0.22, weight: 0.00000022, views: 35000 },
  1919: { maxBonus: 0.22, weight: 0.00000022, views: 35000 },
  1920: { maxBonus: 0.22, weight: 0.00000022, views: 40000 },
  1921: { maxBonus: 0.22, weight: 0.00000022, views: 40000 },
  1922: { maxBonus: 0.22, weight: 0.00000022, views: 40000 },
  1923: { maxBonus: 0.22, weight: 0.00000022, views: 40000 },
  1924: { maxBonus: 0.22, weight: 0.00000022, views: 40000 },
  1925: { maxBonus: 0.22, weight: 0.00000022, views: 45000 },
  1926: { maxBonus: 0.22, weight: 0.00000022, views: 45000 },
  1927: { maxBonus: 0.22, weight: 0.00000022, views: 45000 },
  1928: { maxBonus: 0.22, weight: 0.00000022, views: 45000 },
  1929: { maxBonus: 0.22, weight: 0.00000022, views: 45000 },
  1930: { maxBonus: 0.22, weight: 0.00000022, views: 50000 },
  1931: { maxBonus: 0.22, weight: 0.00000022, views: 50000 },
  1932: { maxBonus: 0.22, weight: 0.00000022, views: 50000 },
  1933: { maxBonus: 0.22, weight: 0.00000022, views: 50000 },
  1934: { maxBonus: 0.22, weight: 0.00000022, views: 50000 },
  1935: { maxBonus: 0.22, weight: 0.00000022, views: 50000 },
  1936: { maxBonus: 0.22, weight: 0.00000021, views: 50000 },
  1937: { maxBonus: 0.22, weight: 0.00000021, views: 50000 },
  1938: { maxBonus: 0.22, weight: 0.00000021, views: 50000 },
  1939: { maxBonus: 0.22, weight: 0.00000021, views: 50000 },
  1940: { maxBonus: 0.22, weight: 0.00000021, views: 50000 },
  1941: { maxBonus: 0.22, weight: 0.00000021, views: 50000 },
  1942: { maxBonus: 0.22, weight: 0.00000021, views: 50000 },
  1943: { maxBonus: 0.22, weight: 0.00000021, views: 50000 },
  1944: { maxBonus: 0.22, weight: 0.00000021, views: 50000 },
  1945: { maxBonus: 0.22, weight: 0.00000021, views: 50000 },
  1946: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1947: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1948: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1949: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1950: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1951: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1952: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1953: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1954: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1955: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1956: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1957: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1958: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1959: { maxBonus: 0.22, weight: 0.00000021, views: 55000 },
  1960: { maxBonus: 0.22, weight: 0.00000021, views: 60000 },
  1961: { maxBonus: 0.22, weight: 0.00000021, views: 60000 },
  1962: { maxBonus: 0.22, weight: 0.00000021, views: 60000 },
  1963: { maxBonus: 0.22, weight: 0.00000021, views: 60000 },
  1964: { maxBonus: 0.22, weight: 0.00000021, views: 60000 },
  1965: { maxBonus: 0.22, weight: 0.00000021, views: 65000 },
  1966: { maxBonus: 0.22, weight: 0.00000021, views: 65000 },
  1967: { maxBonus: 0.22, weight: 0.00000021, views: 65000 },
  1968: { maxBonus: 0.22, weight: 0.00000021, views: 65000 },
  1969: { maxBonus: 0.22, weight: 0.00000021, views: 65000 },
  1970: { maxBonus: 0.2, weight: 0.0000001735, views: 65000 },
  1971: { maxBonus: 0.2, weight: 0.0000001735, views: 70000 },
  1972: { maxBonus: 0.2, weight: 0.0000001735, views: 70000 },
  1973: { maxBonus: 0.2, weight: 0.0000001735, views: 70000 },
  1974: { maxBonus: 0.2, weight: 0.0000001735, views: 70000 },
  1975: { maxBonus: 0.2, weight: 0.0000001735, views: 70000 },
  1976: { maxBonus: 0.2, weight: 0.0000001735, views: 70000 },
  1977: { maxBonus: 0.2, weight: 0.0000001735, views: 70000 },
  1978: { maxBonus: 0.2, weight: 0.0000001735, views: 70000 },
  1979: { maxBonus: 0.2, weight: 0.0000001735, views: 70000 },
  1980: { maxBonus: 0.18, weight: 0.000000147, views: 75000 },
  1981: { maxBonus: 0.18, weight: 0.000000147, views: 75000 },
  1982: { maxBonus: 0.18, weight: 0.000000147, views: 75000 },
  1983: { maxBonus: 0.18, weight: 0.000000147, views: 75000 },
  1984: { maxBonus: 0.18, weight: 0.000000147, views: 75000 },
  1985: { maxBonus: 0.18, weight: 0.000000147, views: 90000 },
  1986: { maxBonus: 0.18, weight: 0.000000147, views: 90000 },
  1987: { maxBonus: 0.18, weight: 0.000000147, views: 90000 },
  1988: { maxBonus: 0.18, weight: 0.000000147, views: 90000 },
  1989: { maxBonus: 0.18, weight: 0.000000147, views: 90000 },
  1990: { maxBonus: 0.16, weight: 0.0000001205, views: 100000 },
  1991: { maxBonus: 0.16, weight: 0.0000001205, views: 100000 },
  1992: { maxBonus: 0.16, weight: 0.0000001205, views: 100000 },
  1993: { maxBonus: 0.16, weight: 0.0000001205, views: 100000 },
  1994: { maxBonus: 0.16, weight: 0.0000001205, views: 100000 },
  1995: { maxBonus: 0.16, weight: 0.0000001205, views: 100000 },
  1996: { maxBonus: 0.16, weight: 0.0000001205, views: 100000 },
  1997: { maxBonus: 0.16, weight: 0.0000001205, views: 100000 },
  1998: { maxBonus: 0.16, weight: 0.0000001205, views: 100000 },
  1999: { maxBonus: 0.16, weight: 0.0000001205, views: 100000 },
  2000: { maxBonus: 0.16, weight: 0.000000094, views: 150000 },
  2001: { maxBonus: 0.16, weight: 0.000000094, views: 150000 },
  2002: { maxBonus: 0.16, weight: 0.000000094, views: 150000 },
  2003: { maxBonus: 0.16, weight: 0.000000094, views: 150000 },
  2004: { maxBonus: 0.16, weight: 0.000000094, views: 150000 },
  2005: { maxBonus: 0.16, weight: 0.000000094, views: 150000 },
  2006: { maxBonus: 0.14, weight: 0.000000094, views: 150000 },
  2007: { maxBonus: 0.14, weight: 0.000000094, views: 150000 },
  2008: { maxBonus: 0.14, weight: 0.000000094, views: 150000 },
  2009: { maxBonus: 0.14, weight: 0.000000094, views: 150000 },
  2010: { maxBonus: 0.14, weight: 0.000000094, views: 200000 },
  2011: { maxBonus: 0.14, weight: 0.000000094, views: 200000 },
  2012: { maxBonus: 0.14, weight: 0.000000094, views: 200000 },
  2013: { maxBonus: 0.14, weight: 0.000000094, views: 200000 },
  2014: { maxBonus: 0.14, weight: 0.000000094, views: 200000 },
  2015: { maxBonus: 0.13, weight: 0.000000094, views: 200000 },
  2016: { maxBonus: 0.13, weight: 0.000000094, views: 200000 },
  2017: { maxBonus: 0.13, weight: 0.000000094, views: 200000 },
  2018: { maxBonus: 0.13, weight: 0.000000094, views: 200000 },
  2019: { maxBonus: 0.13, weight: 0.000000094, views: 200000 },
  2020: { maxBonus: 0.13, weight: 0.000000094, views: 200000 },
  2021: { maxBonus: 0.11, weight: 0.000000094, views: 200000 },
  2022: { maxBonus: 0.11, weight: 0.000000094, views: 200000 },
  2023: { maxBonus: 0.1, weight: 0.000000094, views: 200000 },
  2024: { maxBonus: 0.1, weight: 0.000000094, views: 200000 },
  2025: { maxBonus: 0.1, weight: 0.000000094, views: 200000 },
  2026: { maxBonus: 0.1, weight: 0.000000094, views: 200000 },
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
  'demon-slayer-kimetsu-no-yaiba-the-movie-mugen', // Based on TV show
  'euphoria-fck-anyone-whos-not-a-sea-blob', // TV show
  'euphoria-trouble-dont-last-always', // TV show
  'free-solo', // Documentary
  'fullmetal-alchemist-brotherhood', // TV show
  'grizzly-man', // Documentary
  'hamilton-2020', // Concert
  'the-haunting-2018', // TV mini series,
  'the-haunting-of-bly-manor', // TV mini series
  'jujutsu-kaisen-0',
  'koyaanisqatsi', // Photography with no plot
  'la-jetee', // Short film
  'loki-2021', // TV show
  'man-with-a-movie-camera', // Documentary
  'meshes-of-the-afternoon', // Short film
  'michael-jacksons-thriller', // Music video,
  'mickeys-christmas-carol',
  'miss-americana', // Documentary
  'neon-genesis-evangelion', // TV show
  'neon-genesis-evangelion-the-end-of-evangelion', // TV movie
  'night-and-fog', // Short film
  'normal-people-2020', // TV mini series
  'over-the-garden-wall-2014', // TV mini series
  'paris-is-burning', // Documentary
  'persepolis', // Just because
  'pink-floyd-the-wall',
  'planet-earth-2006', // Documentary
  'squid-game', // TV show
  'the-queens-gambit', // TV mini series
  'stop-making-sense', // Concert
  'taylor-swift-the-eras-tour', // Concert
  'twin-peaks', // TV show
  'twin-peaks-the-return', // TV show
  'the-wrong-trousers', // Short film
  'vincent', // Short film
  'wallace-gromit-the-curse-of-the-were-rabbit', // Short film
  'wandavision', // TV show
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
                  const year = this.getFilmYear(html);
                  return {
                    ...film,
                    year,
                    weightedRating: this.getWeightedFilmRating(
                      film.rating,
                      film.views,
                      film.slug,
                      year
                    ),
                  };
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
            const popularityThreshold = movieYear[film.year].views;
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
        return rating - 0.1;
      }
      return rating - 0.05;
    }

    const maxBonus = movieYear[year].maxBonus;
    const weight = movieYear[year].weight;

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
    return +this.getYear(html);
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

  private getYear(filmHtml: string): string {
    let titleIndex = filmHtml.indexOf('title="');
    if (titleIndex < 0) {
      return '';
    }

    titleIndex += 8;
    const endIndex = filmHtml.indexOf('"', titleIndex);
    return filmHtml.substring(endIndex - 5, endIndex - 1);
  }
}
