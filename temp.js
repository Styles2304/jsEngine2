class ent {
    constructor() {
        this.pos = new vect();
        this.vel = new vect();
        this.acc = new vect();
        this.mass = mass; // Create "constructor" for enabling physics?
    }

    // enablePhysics(mass, )

    applyForce(force) {
        var _f = vect.div(force, this.mass);
        this.acc.add(_f);
    }

    classUpdate() {
        this.acc.mult(0);

        this.vel.add(this.acc);
        this.pos.add(this.vel);
    }

    // Example update //
    update() {
        var gravity = new vect(0,0.3);
        gravity.mult(this.mass); // Gravity is a unique force that sort of ignores mass
        this.applyForce(gravity);
    }
    // End Example //
}