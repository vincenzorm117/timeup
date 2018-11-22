import { Component } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { ScreenPlay, ScreenPlayEqual } from 'src/app/interfaces/ScreenPlay';
import { Apollo } from 'apollo-angular';
import { gqlSearchQuery, gqlGetScreenPlayQuery } from '../../../graphql';
import Time from 'src/app/classes/time';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    
    searchTerm: string = '';
    screenplays: ScreenPlay[] = []
    
    watchedScreenplaysSet = new Set();
    watchedScreenplays: ScreenPlay[] = [];
    totalWatchTime = 0
    time = new Time(0);
    htmlAttrView = 0;
    htmlAttrViewOptions = ['grid','micro'];

    constructor(private state: StateService, private apollo: Apollo) {
        let runtime = parseInt(localStorage.getItem('tu-runtime'))
        this.totalWatchTime = isNaN(runtime) ? 0 : runtime
        this.time.setTimeMinutes(this.totalWatchTime);
        try {
            let watchedScreenplays = JSON.parse(localStorage.getItem('tu-watched-movies'))
            this.watchedScreenplays = Array.isArray(watchedScreenplays) ? watchedScreenplays : [];
            for(let screenplay of this.watchedScreenplays) {
                this.watchedScreenplaysSet.add(screenplay.imdbID);
            }
        } catch(_) { console.error(_) }
    }

    async searchMovies() {
        if( this.searchTerm.length < 3 ) {
            this.screenplays = [];
            return;
        }
        let variables = { searchTerm: this.searchTerm }

        try {
            var result = await this.apollo.query({ query: gqlSearchQuery, variables }).toPromise()
            this.screenplays = result.data['search'];
            this.screenplays = this.screenplays.filter(s => !this.watchedScreenplaysSet.has(s.imdbID))
        } catch(_) { 
            console.warn(_)
            // TODO: Handle error
        }
    }

    async getScreenPlay(screenplay: ScreenPlay) {
        let variables = { id: screenplay.imdbID }

        try {
            let result = await this.apollo.query({ fetchPolicy: 'network-only', query: gqlGetScreenPlayQuery, variables }).toPromise()
            if( !result['data']['screenplay'] ) {
                throw new Error('Screenplay error.')
            }
            this.screenplays = this.screenplays.filter(s => !ScreenPlayEqual(s, result['data']['screenplay']) );
            this.addScreenPlay(result['data']['screenplay'] as ScreenPlay);
        } catch(_) {
            console.warn(_)
            // TODO: Handle error
        }
    }

    async addScreenPlay(screenplay: ScreenPlay) {
        if( this.watchedScreenplaysSet.has(screenplay.imdbID) ) {
            // TODO: Fix this;
            return;
        }
        this.watchedScreenplaysSet.add(screenplay.imdbID);
        if( !isNaN(screenplay.RuntimeMinutes) ) {
            this.totalWatchTime += screenplay.RuntimeMinutes;
        }
        this.time.setTimeMinutes(this.totalWatchTime);
        this.watchedScreenplays.push(screenplay);
        localStorage.setItem('tu-watched-movies', JSON.stringify(this.watchedScreenplays));
        localStorage.setItem('tu-runtime', JSON.stringify(this.totalWatchTime));
    }

    reset() {
        if( !confirm("Are you sure you wish to reset everything?") ) {
            return;
        }
        this.watchedScreenplays = [];
        this.totalWatchTime = 0;
        this.watchedScreenplaysSet.clear();
        localStorage.setItem('tu-watched-movies', JSON.stringify(this.watchedScreenplays));
        localStorage.setItem('tu-runtime', JSON.stringify(this.totalWatchTime));
        this.time.setTimeMinutes(this.totalWatchTime);
    }

    toggleViewType() {
        this.htmlAttrView = (this.htmlAttrView + 1) % this.htmlAttrViewOptions.length;
    }
}
