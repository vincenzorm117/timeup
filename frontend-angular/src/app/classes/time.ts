


export default class Time {

    // Time in minutes
    time: number = 0;
    display: string = null;

    minutes: number = 0;
    hours: number = 0;
    days: number = 0;
    months: number = 0;
    years: number = 0;

    constructor(time: number) {
        this.setTimeMinutes(time)
    }

    setTimeMinutes(time: number) {
        this.time = time;

        this.minutes = this.time % 60;
        this.hours = ((this.time / 60) | 0) % 24;
        this.days = ((this.time / (60 * 24)) | 0) % 31;
        this.months = ((this.time / (60 * 24 * 31)) | 0) % 12;
        this.years = (this.time / (60 * 24 * 365)) | 0;
    }
}