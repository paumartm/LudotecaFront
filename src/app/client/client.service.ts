import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Client } from './model/Client';
import { PaginatedData } from '../core/model/page/PaginatedData';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ClientService {
    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/client';

    getClients(): Observable<Client[]> {
            return this.http.get<Client[]>(this.baseUrl);
        }

    saveClient(client: Client): Observable<Client> {
        const { id } = client;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Client>(url, client);
    }

    deleteClient(idClient: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${idClient}`);
    }

    getAllClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.baseUrl);
    }
}
