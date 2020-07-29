/**
 * GAME Class
 * @typedef {{}} GAME
 */
    class GAME {
        /**
         * The "Mother Class" that contains all game information
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
            this.debug = debug || false;

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
         * @param {String}  name        Unique name given to the state
         * @param {Array}   oneTime     Array of functions to only call once
         * @param {Array}   doLoop      Array of functions to call every frame
         */
        addState(name, oneTime, doLoop) { this.states[name] = new State(this, oneTime, doLoop); }

        /**
         * Starts the specified State
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
            let that = this; // For reference inside event listeners

            this.STAGE.addEventListener('mousemove', function(evt) {
                var _offset = this.getBoundingClientRect();
                that.mouse.pos.x = evt.clientX - _offset.left;
                that.mouse.pos.y = evt.clientY - _offset.top;
            });

        // Setup the key listeners for common keys
            window.onkeydown = function(e) {
                var key = e.keyCode ? e.keyCode : e.which;
                switch (key) {
                    case 13: that.keys.enter = true; e.preventDefault(); break;
                    case 32: that.keys.space = true; e.preventDefault(); break;
                    case 37: that.keys.left = true; e.preventDefault(); break;
                    case 38: that.keys.up = true; e.preventDefault(); break;
                    case 39: that.keys.right = true; e.preventDefault(); break;
                    case 40: that.keys.down = true; e.preventDefault(); break;
                    case 49: that.keys.one = true; e.preventDefault(); break;
                    case 50: that.keys.two = true; e.preventDefault(); break;
                    case 65: that.keys.a = true; e.preventDefault(); break;
                    case 66: that.keys.b = true; e.preventDefault(); break;
                    case 67: that.keys.c = true; e.preventDefault(); break;
                    case 68: that.keys.d = true; e.preventDefault(); break;
                    case 69: that.keys.e = true; e.preventDefault(); break;
                    case 70: that.keys.f = true; e.preventDefault(); break;
                    case 71: that.keys.g = true; e.preventDefault(); break;
                    case 72: that.keys.h = true; e.preventDefault(); break;
                    case 73: that.keys.i = true; e.preventDefault(); break;
                    case 74: that.keys.j = true; e.preventDefault(); break;
                    case 75: that.keys.k = true; e.preventDefault(); break;
                    case 76: that.keys.l = true; e.preventDefault(); break;
                    case 77: that.keys.m = true; e.preventDefault(); break;
                    case 78: that.keys.n = true; e.preventDefault(); break;
                    case 79: that.keys.o = true; e.preventDefault(); break;
                    case 80: that.keys.p = true; e.preventDefault(); break;
                    case 81: that.keys.q = true; e.preventDefault(); break;
                    case 82: that.keys.r = true; e.preventDefault(); break;
                    case 83: that.keys.s = true; e.preventDefault(); break;
                    case 84: that.keys.t = true; e.preventDefault(); break;
                    case 85: that.keys.u = true; e.preventDefault(); break;
                    case 86: that.keys.v = true; e.preventDefault(); break;
                    case 87: that.keys.w = true; e.preventDefault(); break;
                    case 88: that.keys.x = true; e.preventDefault(); break;
                    case 89: that.keys.y = true; e.preventDefault(); break;
                    case 90: that.keys.z = true; e.preventDefault(); break;
                }
            }

            window.onkeyup = function(e) {
                var key = e.keyCode ? e.keyCode : e.which;
                switch (key) {
                    case 13: that.keys.enter = false; break;
                    case 32: that.keys.space = false; break;
                    case 37: that.keys.left = false; break;
                    case 38: that.keys.up = false; break;
                    case 39: that.keys.right = false; break;
                    case 40: that.keys.down = false; break;
                    case 49: that.keys.one = false; break;
                    case 50: that.keys.two = false; break;
                    case 65: that.keys.a = false; break;
                    case 66: that.keys.b = false; break;
                    case 67: that.keys.c = false; break;
                    case 68: that.keys.d = false; break;
                    case 69: that.keys.e = false; break;
                    case 70: that.keys.f = false; break;
                    case 71: that.keys.g = false; break;
                    case 72: that.keys.h = false; break;
                    case 73: that.keys.i = false; break;
                    case 74: that.keys.j = false; break;
                    case 75: that.keys.k = false; break;
                    case 76: that.keys.l = false; break;
                    case 77: that.keys.m = false; break;
                    case 78: that.keys.n = false; break;
                    case 79: that.keys.o = false; break;
                    case 80: that.keys.p = false; break;
                    case 81: that.keys.q = false; break;
                    case 82: that.keys.r = false; break;
                    case 83: that.keys.s = false; break;
                    case 84: that.keys.t = false; break;
                    case 85: that.keys.u = false; break;
                    case 86: that.keys.v = false; break;
                    case 87: that.keys.w = false; break;
                    case 88: that.keys.x = false; break;
                    case 89: that.keys.y = false; break;
                    case 90: that.keys.z = false; break;
                }
            }
        }
    }
