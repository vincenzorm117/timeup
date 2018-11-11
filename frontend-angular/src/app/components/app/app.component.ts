import { Component } from '@angular/core';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    value = ''
    movies: object[] = []

    constructor(private state: StateService) {}


    async searchMovie() {
        if( this.value.length < 3 ) {
            return;
        }
        this.movies = await this.state.setSearchTerm(this.value)
        console.log(this.movies)
    }
}
