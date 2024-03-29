class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;
        this.canvas = this.viewport.canvas;
        this.graph = graph;
        this.ctx = this.canvas.getContext('2d');

        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;

        // this.#addEventListener();
    }

    enable() {
        this.#addEventListener();
    }

    disable() {
        this.#removeEventListener();
        this.selected = false
        this.hovered = false
    }

    #addEventListener() {
        this.boundMouseDown = this.#handleMouseDown.bind(this)
        this.boundMouseMove = this.#handleMouseMove.bind(this)
        this.boundMouseUp = () => this.dragging = false
        this.boundContextMenu = e => e.preventDefault()

        this.canvas.addEventListener('mousedown', this.boundMouseDown)
        this.canvas.addEventListener('mousemove', this.boundMouseMove)
        this.canvas.addEventListener('mouseup', this.boundMouseUp)
        this.canvas.addEventListener('contextmenu', this.boundContextMenu)
    }

    #removeEventListener() {
        this.canvas.removeEventListener('mousedown', this.boundMouseDown)
        this.canvas.removeEventListener('mousemove', this.boundMouseMove)
        this.canvas.removeEventListener('mouseup', this.boundMouseUp)
        this.canvas.removeEventListener('contextmenu', this.boundContextMenu)
    }



    #handleMouseDown(e) {
        if (e.button == 2) { // right click

            if (this.selected) {
                this.selected = null;
            } else if (this.hovered) {
                this.#removePoint(this.hovered);
            }
            // if (this.hovered) {
            //     this.#removePoint(this.hovered)
            // } else {
            //     this.selected = null;
            // }
        }
        if (e.button == 0) { // left click
            // const mouse = new Point(e.offsetX, e.offsetY);
            // this.hovered = getNearestPoint(mouse, this.graph.points, 10);
            if (this.hovered) {
                this.#select(this.hovered)
                // console.log('closest point selected', this.hovered)
                this.dragging = true;
                return;
            }
            this.graph.addPoint(this.mouse);
            this.#select(this.mouse)
            this.hovered = this.mouse;
            // console.log('new point created')
        }
    }

    #handleMouseMove(e) {
        this.mouse = this.viewport.getMouse(e, true)
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 5 * viewport.zoom);

        if (this.dragging) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
        // if (this.hovered) {
        //     this.selected = this.hovered;
        //     console.log('closest point selected', this.hovered)
        //     return;
        // }
        // this.graph.addPoint(this.mouse);
        // this.selected = mouse;
        // console.log('new point created')
    }

    #select(point) {
        if (this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point))
        }
        this.selected = point;
    }

    #removePoint(point) {
        this.graph.removePoint(point);
        this.hovered = null;
        if (this.selected == point)
            this.selected = null;
    }

    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
    }

    display() {
        this.graph.draw(this.ctx);

        if (this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent).draw(ctx, { dash: [3, 3] });
            this.selected.draw(this.ctx, { outline: true });
        }
        if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true })
        }

        // else if(this.selected && this.hovered){
        //     this.selected.draw(this.ctx, { fill: true, outline: true });
        // }
    }
}