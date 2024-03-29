class MarkingEditor {
    constructor(viewport, world, targetSegments) {
        this.viewport = viewport;
        this.world = world;

        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext("2d");

        this.targetSegments = targetSegments

        this.mouse = null
        this.intent = null
        this.markings = world.markings
    }

    // be over writen
    createMarking(center, directionVector){
        return center;
    }

    enable() {
        this.#addEventListener();
    }

    disable() {
        this.#removeEventListener();
    }

    #addEventListener() {
        this.boundMouseDown = this.#handleMouseDown.bind(this)
        this.boundMouseMove = this.#handleMouseMove.bind(this)
        // this.boundMouseUp = () => this.dragging = false
        this.boundContextMenu = e => e.preventDefault()

        this.canvas.addEventListener('mousedown', this.boundMouseDown)
        this.canvas.addEventListener('mousemove', this.boundMouseMove)
        // this.canvas.addEventListener('mouseup', this.boundMouseUp)
        this.canvas.addEventListener('contextmenu', this.boundContextMenu)
    }

    #removeEventListener() {
        this.canvas.removeEventListener('mousedown', this.boundMouseDown)
        this.canvas.removeEventListener('mousemove', this.boundMouseMove)
        // this.canvas.removeEventListener('mouseup', this.boundMouseUp)
        this.canvas.removeEventListener('contextmenu', this.boundContextMenu)
    }

    #handleMouseDown(e) {
        if (e.button == 0) { // left clikc
            if (this.intent) {
                this.markings.push(this.intent)
                this.intent = null
            }
        }
        if (e.button == 2) {
            for (let i = 0; i < this.markings.length; i++) {
                const poly = this.markings[i].poly;
                if (poly.containsPoint(this.mouse)) {
                    this.markings.splice(i, 1);
                    return
                }
            }
        }
    }

    #handleMouseMove(e) {
        this.mouse = this.viewport.getMouse(e, true)
        const seg = getNearestSegment(
            this.mouse,
            this.targetSegments,
            9 * this.viewport.zoom
        );
        if (seg) {
            const proj = seg.projectPoint(this.mouse)
            if (proj.offset >= 0 && proj.offset <= 1) {
                this.intent = this.createMarking(
                    proj.point,
                    seg.directionVector()
                )
            } else {
                this.intent = null;
            }
        } else {
            this.intent = null
        }
    }

    display() {
        // console.log(typeof(this.intent), this.intent)
        if (this.intent) {
            this.intent.draw(this.ctx)
        }
    }
}