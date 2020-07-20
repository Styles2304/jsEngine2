"use strict";

// Static methods?

class vect {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
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

    static div(v, scal) {
        v.x = v.x / scal;
        v.y = v.y / scal;
        return v;
    }

    getMag() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    norm() {
        this.x = this.x / this.getMag();
        this.y = this.y / this.getMag();
    }

    setMag(mag) {
        this.norm();
        this.mult(mag);
    }

    limit(max) {
        if (this.getMag() > max) { this.setMag(max); }
    }
}