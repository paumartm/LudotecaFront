import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Category } from './model/category';

@Injectable({
providedIn: 'root'
})
export class CategoryService { 

    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/category';

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.baseUrl);
    }

    saveCategory(category: Category): Observable<Category> {
        return of(null);
    }

    deleteCategory(idCategory : number): Observable<any> {
        return of(null);
    }  
}
