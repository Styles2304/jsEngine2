"use strict";
/**
 * Vector Class
 * @typedef {{}} Vector
 */
    class Vector {
        /**
         * Custom Vector class
         * @constructor
         * @param {number} x
         * @param {number} y
         */
        constructor(x, y) {
            if (typeof x === 'undefined') { this.x = 0; } else { this.x = x; }
            if (typeof y === 'undefined') { this.y = 0; } else { this.y = y; }
        }

        add(v) {
            this.x += v.x;
            this.y += v.y;
        }

        static add(v1, v2) {
            let _rV = new Vector();
            _rV.x = v1.x + v2.x;
            _rV.y = v1.y + v2.y;
            return _rV;
        }

        sub(v) {
            this.x -= v.x;
            this.y -= v.y;
        }

        static sub(v1, v2) {
            let _rV = new Vector();
            _rV.x = v1.x - v2.x;
            _rV.y = v1.y - v2.y;
            return _rV;
        }

        mult(scal) {
            this.x = this.x * scal;
            this.y = this.y * scal;
        }

        static mult(v, scal) {
            let _rV = new Vector();
            _rV.x = v.x * scal;
            _rV.y = v.y * scal;
            return _rV;
        }

        div(scal) {
            this.x = this.x / scal;
            this.y = this.y / scal;
        }

        static div(v, scal) {
            let _rV = new Vector();
            _rV.x = v.x / scal;
            _rV.y = v.y / scal;
            return _rV;
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

        rot(angle) {
            this.x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
            this.y = this.y * Math.cos(angle) + this.x * Math.sin(angle);
        }

        static rot(v, angle, pos) {
            let _rV = new Vector();
            v = Vector.sub(v, pos);
            _rV.x = v.x * Math.cos(angle) - v.y * Math.sin(angle);
            _rV.y = v.y * Math.cos(angle) + v.x * Math.sin(angle);
            _rV = Vector.add(_rV, pos);
            return _rV;
        }

        fromAngle(angle, length) {
            if (typeof length === 'undefined') { length = 1; }
            return new Vector(length * Math.cos(angle), length * Math.sin(angle));
        }
    }
