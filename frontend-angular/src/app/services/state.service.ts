import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScreenPlay } from '../interfaces/ScreenPlay';


@Injectable()
export class StateService {

    searchTerm: string;
    movies: object[] = [];
    watchesMovies: object[] = [];
    totalRuntime = 0

    constructor(private http: HttpClient) {}

    async setSearchTerm(searchTerm: string) {
        let isSame = searchTerm == this.searchTerm
        this.searchTerm = searchTerm;
        if( isSame ) {
            return;
        }
        this.movies = await this.search(searchTerm);
        return this.movies;
    }

    private search(term: string) {
        term = encodeURIComponent(term)
        return this.http.get<ScreenPlay[]>(`/api/movie?s=${term}`, { 
            withCredentials: true,
            // headers: this.auth.accessTokenHeader
        }).toPromise()
    }
}

