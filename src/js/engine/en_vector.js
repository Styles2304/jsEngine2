"use strict";
/**
 * Vector Class
 * @typedef {{}} Vector
 */
    class Vector {
        /**
         * Custom Vector class
         * @param {number} x
         * @param {number} y
         */
        constructor(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }

        add(v) {
            this.x += v.x;
            this.y += v.y;
        }

        static add(v1, v2) {
            var _v = new Vector();
            _v.x = v1.x + v2.x;
            _v.y = v1.y + v2.y;
            return _v;
        }

        sub(v) {
            this.x -= v.x;
            this.y -= v.y;
        }

        static sub(v1, v2) {
            var _v = new Vector();
            _v.x = v1.x - v2.x;
            _v.y = v1.y - v2.y;
            return _v;
        }

        mult(scal) {
            this.x = this.x * scal;
            this.y = this.y * scal;
        }

        static mult(v, scal) {
            var _v = new Vector();
            _v.x = v.x * scal;
            _v.y = v.y * scal;
            return _v;
        }

        div(scal) {
            this.x = this.x / scal;
            this.y = this.y / scal;
        }

        static div(v, scal) {
            var _v = new Vector();
            _v.x = v.x / scal;
            _v.y = v.y / scal;
            return _v;
        }

        norm() {
            this.x = this.x / this.getMag();
            this.y = this.y / this.getMag();
        }

        getMag() {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        }

        magSq() {
            return (this.x * this.x + this.y * this.y);
        }

        setMag(mag) {
            this.norm();
            this.mult(mag);
        }

        limit(max) {
            if (this.magSq() > max*max) {
                this.setMag(max);
            }
        }

        copy() {
            return new Vector(this.x, this.y);
        }
        
        static copy(v) {
            return new Vector(v.x, v.y);
        }
    }
