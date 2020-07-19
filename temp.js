class ent {
    constructor() {
        this.pos = new vect();
        this.vel = new vect();
        this.acc = new vect();
        this.mass = mass; // Create "constructor" for enabling physics?
    }

    applyForce(force) {
        force.div(this.mass); // Convert to static
        this.acc.add(force);
    }

    classUpdate() {
        this.acc.mult(0);

        this.vel.add(this.acc);
        this.pos.add(this.vel);
    }

    // Example update //
    update() {
        var gravity = new vect(0,0.3);
        this.applyForce(gravity);
    }
    // End Example //
}