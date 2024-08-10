import { TestBed } from '@angular/core/testing';

import { LetterboxdScraperService } from './letterboxd-scraper.service';

describe('LetterboxdScraperService', () => {
  let service: LetterboxdScraperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LetterboxdScraperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
