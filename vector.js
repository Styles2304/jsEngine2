"use strict";

class vect {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vect) {
        this.x += vect.x;
        this.y += vect.y;
    }
    sub(vect) {
        this.x -= vect.x;
        this.y -= vect.y;
    }
    mult(scal) {
        this.x = this.x * scal;
        this.y = this.y * scal;
    }
    div(scal) {
        this.x = this.x / scal;
        this.y = this.y / scal;
    }
    mag() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    norm() {
        this.x = this.x / this.mag();
        this.y = this.y / this.mag();
    }
    setMag(mag) {
        this.norm();
        this.mult(mag);
    }
    limit(max) {
        if (this.mag() > max) { this.setMag(max); }
    }
}