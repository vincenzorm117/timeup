import { Component } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { ScreenPlay } from 'src/app/interfaces/ScreenPlay';
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
    screenplays: object[] = []
    
    watchedScreenplaysSet = new Set();
    watchedScreenplays: ScreenPlay[] = [];
    totalWatchTime = 0
    time = new Time(0);

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
            return;
        }
        let variables = { searchTerm: this.searchTerm }

        try {
            var result = await this.apollo.query({ query: gqlSearchQuery, variables }).toPromise()
            this.screenplays = result.data['search'];
        } catch(_) { 
            console.error(_)
            // TODO: Handle error
        }
    }

    async getScreenPlay(screenplay: ScreenPlay) {
        let variables = { id: screenplay.imdbID }

        try {
            let result = await this.apollo.query({ query: gqlGetScreenPlayQuery, variables }).toPromise()
            let screenplay = result['data']['screenplay'];
            this.addScreenPlay(screenplay as ScreenPlay)
        } catch(_) {
            console.error(_)
            // TODO: Handle error
        }
    }

    async addScreenPlay(screenplay: ScreenPlay) {
        if( this.watchedScreenplaysSet.has(screenplay.imdbID) ) {
            // TODO: Fix this;
            return;
        }
        this.watchedScreenplaysSet.add(screenplay.imdbID);
        this.totalWatchTime += screenplay.RuntimeMinutes;
        this.time.setTimeMinutes(this.totalWatchTime);
        this.watchedScreenplays.push(screenplay);
        localStorage.setItem('tu-watched-movies', JSON.stringify(this.watchedScreenplays));
        localStorage.setItem('tu-runtime', JSON.stringify(this.totalWatchTime));
    }
}
