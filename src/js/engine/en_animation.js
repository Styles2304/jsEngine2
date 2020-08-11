"use strict";
/**
 * Animation Class
 * @typedef {{}} Anim
 * 
 * TO-DO
 *  - Callback for animation complete
 */
    class Anim {
        /**
         * Animation Class
         * @constructor
         * @param {{}} context Pointer to the GAME's context
         * @param {{}} entity Pointer to the entity containing the animation
         * @param {String} name Name of the animation
         * @param {String} src Location of Source Image
         * @param {Number} duration Length of time to get through the entire animation in seconds
         * @param {Boolean} flipped Whether or not to draw the image mirrored
         * @param {Array} frames Frames added to animation at creation or a blank array
         */
        constructor(context, entity, name, src, duration, flipped, frames) {
            this.ctx = context;
            this.ent = entity;
            this.name = name;
            this.src = src;
            this.duration = Math.floor(duration * entity.Game.FPS);
            this.flipped = flipped;
            this.frames = frames;
            this.playing = false;
            this.ticks = 1;
        }

        /**
         * Adds a frame to the animation to be played by play()
         * @method addFrame
         * @param {Number} sx Source X
         * @param {Number} sy Source Y
         * @param {Number} sw Source Width
         * @param {Number} sh Source Height
         * @param {Number} start Starting percentage of animation duration to display frame
         * @param {Number} end Ending percentage of animation duration to display frame
         */
        addFrame(sx, sy, sw, sh, start, end) {
            this.frames.push({
                x: sx,
                y: sy,
                w: sw,
                h: sh,
                start: start,
                end: end
            });
        }

        /**
         * Draws the animation from the frame data
         * @method play
         */
        play() {
            // Prevents animation from being called every tick if already playing
            if (!this.playing) {
                Object.keys(this.ent.animations).forEach(key => {
                    this.ent.animations[key].playing = false;
                });
                this.playing = true;
                this.ticks = 1;
            }

            if (this.playing) {
                let curFrame;

            // Loops through animation and picks current frame based on current tick
                for (var a = 0; a < this.frames.length; a++) {
                    let frame = this.frames[a];
                    if (this.ticks >= Math.floor(this.duration * frame.start) && this.ticks <= Math.floor(this.duration * frame.end)) {
                        curFrame = a;
                    }
                }

            // Flips image if specified
                if (this.flipped) {
                    this.ctx.translate(this.ent.pos.x, this.ent.pos.y);
                    this.ctx.scale(-1,1);
                    this.ctx.translate(-this.ent.pos.x, -this.ent.pos.y);
                }

            // Draws current frame of animation
                this.ctx.drawImage(
                    this.src,
                    this.frames[curFrame].x,
                    this.frames[curFrame].y,
                    this.frames[curFrame].w,
                    this.frames[curFrame].h,
                    this.ent.relativePos.x,
                    this.ent.relativePos.y,
                    this.frames[curFrame].w,
                    this.frames[curFrame].h
                );

            // Flips everything else back
            if (this.flipped) {
                this.ctx.setTransform(1,0,0,1,0,0);
            }

            // Ends animation - will restart if told to externally
                if (this.ticks >= this.duration) {
                    this.playing = false;
                } else {
                    this.ticks += 1;
                }
            }
        }
    }