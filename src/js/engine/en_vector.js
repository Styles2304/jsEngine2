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

        /**
         * Adds supplied vector to the instance
         * @method add
         * @param {Vector} v
         */
        add(v) {
            this.x += v.x;
            this.y += v.y;
        }

        /**
         * Adds two supplied vectors together and returns the result
         * @method add
         * @static
         * @param {Vector} v1
         * @param {Vector} v2
         * @returns {Vector}
         */
        static add(v1, v2) {
            let _rV = new Vector();
            _rV.x = v1.x + v2.x;
            _rV.y = v1.y + v2.y;
            return _rV;
        }

        /**
         * Subtracts supplied vector from the instance
         * @method sub
         * @param {Vector} v
         */
        sub(v) {
            this.x -= v.x;
            this.y -= v.y;
        }

        /**
         * Returns the difference between two supplied Vectors
         * @method sub
         * @static
         * @param {Vector} v1
         * @param {Vector} v2
         * @returns {Vector}
         */
        static sub(v1, v2) {
            let _rV = new Vector();
            _rV.x = v1.x - v2.x;
            _rV.y = v1.y - v2.y;
            return _rV;
        }

        /**
         * Multiplies the instance by provided value
         * @method mult
         * @param {Number} scal
         */
        mult(scal) {
            this.x = this.x * scal;
            this.y = this.y * scal;
        }

        /**
         * Returns the product of the provided Vector and Scalar
         * @method mult
         * @static
         * @param {Vector} v 
         * @param {Number} scal
         */
        static mult(v, scal) {
            let _rV = new Vector();
            _rV.x = v.x * scal;
            _rV.y = v.y * scal;
            return _rV;
        }

        /**
         * Divides instance by provided value
         * @method div
         * @param {Number} scal 
         */
        div(scal) {
            this.x = this.x / scal;
            this.y = this.y / scal;
        }

        /**
         * Returns the quotient of the Provided Vector divided by the Scalar
         * @method
         * @static
         * @param {Vector} v Dividend
         * @param {Number} scal Divisor
         */
        static div(v, scal) {
            let _rV = new Vector();
            _rV.x = v.x / scal;
            _rV.y = v.y / scal;
            return _rV;
        }

        /**
         * Normalizes the instance
         * @method norm
         */
        norm() {
            this.x = this.x / this.getMag();
            this.y = this.y / this.getMag();
        }

        /**
         * Returns the magnitude of the instance
         * @method norm
         * @returns {Number} Magnitude
         */
        getMag() {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        }

        /**
         * Returns the Square of the Magnitude
         * @method magSq
         * @returns {Number} Magnitude Squared
         */
        magSq() {
            return (this.x * this.x + this.y * this.y);
        }

        /**
         * Sets the magnitude of the instance
         * @method setMag
         * @param {Number} mag 
         */
        setMag(mag) {
            this.norm();
            this.mult(mag);
        }

        /**
         * Limits the instance to the supplied value
         * @method limit
         * @param {Number} max 
         */
        limit(max) {
            if (this.magSq() > max*max) {
                this.setMag(max);
            }
        }

        /**
         * Returns a copy of the instance
         * @method copy
         * @returns {Vector}
         */
        copy() {
            return new Vector(this.x, this.y);
        }

        /**
         * Rotates the instance by the supplied angle.
         * @method rot
         * @param {Number} angle Must be In Radians
         */
        rot(angle) {
            this.x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
            this.y = this.y * Math.cos(angle) + this.x * Math.sin(angle);
        }

        /**
         * I wrote this in a haze and now I'm not sure why it works...
         * @method rot
         * @static
         * @param {Vector} v 
         * @param {Number} angle Must be in Radians
         * @param {Vector} pos Pivot point?
         * @returns {Vector}
         */
        static rot(v, angle, pos) {
            let _rV = new Vector();
            v = Vector.sub(v, pos);
            _rV.x = v.x * Math.cos(angle) - v.y * Math.sin(angle);
            _rV.y = v.y * Math.cos(angle) + v.x * Math.sin(angle);
            _rV = Vector.add(_rV, pos);
            return _rV;
        }

        /**
         * Returns Vector at supplied angle from instance at supplied length
         * @method fromAngle
         * @param {Number} angle Must be in Radians
         * @param {Number} [length=1] 
         */
        fromAngle(angle, length) {
            if (typeof length === 'undefined') { length = 1; }
            return new Vector(length * Math.cos(angle), length * Math.sin(angle));
        }
    }
