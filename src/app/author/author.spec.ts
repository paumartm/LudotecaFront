import { TestBed } from '@angular/core/testing';
import { Author } from './model/Author';

describe('Author', () => {
  let service: Author;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Author);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
