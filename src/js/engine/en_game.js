/**
 * GAME Class
 * @typedef {{}} GAME
 */
    class GAME {
        /**
         * The "Mother Class" that contains all game information
         * @constructor
         * @param {String}  container id of the Container Element
         * @param {Number}  width Width of game screen
         * @param {Number}  height Height of game screen
         * @param {Number}  fps Frames per second
         * @param {Boolean} [debug=false] Turn debug on for the entire Game
         */
        constructor(container, width, height, fps, debug) {
            this.STAGE = document.createElement("canvas");
            this.STAGE.width = width;
            this.STAGE.height = height;
            this.CONTAINER = document.getElementById(container);
                this.CONTAINER.appendChild(this.STAGE); // Adds the canvas to the container
            this.CONTEXT = this.STAGE.getContext("2d");
            this.FPS = fps;
            this.keys = {
                enter: false,
                lshift: false,
                space: false,
                left: false,
                up: false,
                right: false,
                down: false,
                one: false,
                two: false,
                a: false,
                b: false,
                c: false,
                d: false,
                e: false,
                f: false,
                g: false,
                h: false,
                i: false,
                j: false,
                k: false,
                l: false,
                m: false,
                n: false,
                o: false,
                p: false,
                q: false,
                r: false,
                s: false,
                t: false,
                u: false,
                v: false,
                w: false,
                x: false,
                y: false,
                z: false
            }
            this.mouse = {
                pos: new Vector()
            }
            this.states = {}

            this.curState = null;
            if (typeof debug === 'undefined') { this.debug = false; } else { this.debug = debug; }

            this.run();
        }

        /**
         * Wipe the canvas - called at the beginning of every frame
         * @method refresh
         */
        refresh() { 
            this.CONTEXT.clearRect(
                this.curState.curWorld.camera.pos.x,
                this.curState.curWorld.camera.pos.y,
                this.STAGE.width, this.STAGE.height
            );
        }

        /**
         * Adds a new state to the GAME
         * @method addState
         * @param {String}  name        Unique name given to the state
         * @param {Array}   oneTime     Array of functions to only call once
         * @param {Array}   doLoop      Array of functions to call every frame
         */
        addState(name, oneTime, doLoop) { this.states[name] = new State(this, oneTime, doLoop); }

        /**
         * Starts the specified State
         * @method startState
         * @param {State} State The State to start
         */
        startState(State) {
            if (this.curState !== null) {
                clearInterval(this.curState.runInterval);
            }
            this.curState = this.states[State];
            this.curState.run();
        }

        /**
         * Initiates the game and event listeners
         * @method run
         */
        run() {
            // Init Message
                if (this.debug) { console.log("Game Created"); }

            // Prep the container
                this.CONTAINER.setAttribute(
                "style",
                "width: " + this.STAGE.width + "px; " +
                "height: " + this.STAGE.height + "px; " +
                "background-color: #000000;"
            );

        // Event listener for mouse
            this.STAGE.addEventListener('mousemove', (evt) => {
                var _offset = this.STAGE.getBoundingClientRect();
                this.mouse.pos.x = evt.clientX - _offset.left;
                this.mouse.pos.y = evt.clientY - _offset.top;
            });

        // Setup the key listeners for common keys
            window.onkeydown = (e) => {
                var key = e.keyCode ? e.keyCode : e.which;
                switch (key) {
                    case 13: this.keys.enter = true; e.preventDefault(); break;
                    case 16: this.keys.lshift = true; e.preventDefault(); break;
                    case 32: this.keys.space = true; e.preventDefault(); break;
                    case 37: this.keys.left = true; e.preventDefault(); break;
                    case 38: this.keys.up = true; e.preventDefault(); break;
                    case 39: this.keys.right = true; e.preventDefault(); break;
                    case 40: this.keys.down = true; e.preventDefault(); break;
                    case 49: this.keys.one = true; e.preventDefault(); break;
                    case 50: this.keys.two = true; e.preventDefault(); break;
                    case 65: this.keys.a = true; e.preventDefault(); break;
                    case 66: this.keys.b = true; e.preventDefault(); break;
                    case 67: this.keys.c = true; e.preventDefault(); break;
                    case 68: this.keys.d = true; e.preventDefault(); break;
                    case 69: this.keys.e = true; e.preventDefault(); break;
                    case 70: this.keys.f = true; e.preventDefault(); break;
                    case 71: this.keys.g = true; e.preventDefault(); break;
                    case 72: this.keys.h = true; e.preventDefault(); break;
                    case 73: this.keys.i = true; e.preventDefault(); break;
                    case 74: this.keys.j = true; e.preventDefault(); break;
                    case 75: this.keys.k = true; e.preventDefault(); break;
                    case 76: this.keys.l = true; e.preventDefault(); break;
                    case 77: this.keys.m = true; e.preventDefault(); break;
                    case 78: this.keys.n = true; e.preventDefault(); break;
                    case 79: this.keys.o = true; e.preventDefault(); break;
                    case 80: this.keys.p = true; e.preventDefault(); break;
                    case 81: this.keys.q = true; e.preventDefault(); break;
                    case 82: this.keys.r = true; e.preventDefault(); break;
                    case 83: this.keys.s = true; e.preventDefault(); break;
                    case 84: this.keys.t = true; e.preventDefault(); break;
                    case 85: this.keys.u = true; e.preventDefault(); break;
                    case 86: this.keys.v = true; e.preventDefault(); break;
                    case 87: this.keys.w = true; e.preventDefault(); break;
                    case 88: this.keys.x = true; e.preventDefault(); break;
                    case 89: this.keys.y = true; e.preventDefault(); break;
                    case 90: this.keys.z = true; e.preventDefault(); break;
                }
            }

            window.onkeyup = (e) => {
                var key = e.keyCode ? e.keyCode : e.which;
                switch (key) {
                    case 13: this.keys.enter = false; break;
                    case 16: this.keys.lshift = false; break;
                    case 32: this.keys.space = false; break;
                    case 37: this.keys.left = false; break;
                    case 38: this.keys.up = false; break;
                    case 39: this.keys.right = false; break;
                    case 40: this.keys.down = false; break;
                    case 49: this.keys.one = false; break;
                    case 50: this.keys.two = false; break;
                    case 65: this.keys.a = false; break;
                    case 66: this.keys.b = false; break;
                    case 67: this.keys.c = false; break;
                    case 68: this.keys.d = false; break;
                    case 69: this.keys.e = false; break;
                    case 70: this.keys.f = false; break;
                    case 71: this.keys.g = false; break;
                    case 72: this.keys.h = false; break;
                    case 73: this.keys.i = false; break;
                    case 74: this.keys.j = false; break;
                    case 75: this.keys.k = false; break;
                    case 76: this.keys.l = false; break;
                    case 77: this.keys.m = false; break;
                    case 78: this.keys.n = false; break;
                    case 79: this.keys.o = false; break;
                    case 80: this.keys.p = false; break;
                    case 81: this.keys.q = false; break;
                    case 82: this.keys.r = false; break;
                    case 83: this.keys.s = false; break;
                    case 84: this.keys.t = false; break;
                    case 85: this.keys.u = false; break;
                    case 86: this.keys.v = false; break;
                    case 87: this.keys.w = false; break;
                    case 88: this.keys.x = false; break;
                    case 89: this.keys.y = false; break;
                    case 90: this.keys.z = false; break;
                }
            }
        }

        /**
         * Convert Angle into Radians
         * @method radians
         * @param {Number} angle
         * @returns Radians
         */
        radians(angle) {
            return angle * Math.PI / 180;
        };
    }
