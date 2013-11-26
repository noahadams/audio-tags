(function() {
    var Positionometer = function() {
        var self = this;
        window.addEventListener('devicemotion', function(e) {
            self.deviceMotionHandler(e);
        }, false);
        
        this.reset();
        this.el = document.createElement('div');
        this.callbacks = [];
    };

    Positionometer.prototype.deviceMotionHandler = function(event) {
        // some dirty numerical double integration
        var accel = event.acceleration;
        //var i = event.interval / 1000;
        var i = 0.3;

        //debugger;
        
        var vx = (accel.x - this.ax) * i;
        var vy = (accel.y - this.ay) * i;
        var vz = (accel.z - this.az) * i;

        this.px = (vx - this.vx) * i;
        this.py = (vy - this.vy) * i;
        this.pz = (vz - this.vz) * i;

        this.changePosition();
        // console.log("Position: [ " + this.px + ", " +
        //             this.py + ", " + this.pz + "]");
    };

    Positionometer.prototype.reset = function() {
        // reset velocity and position to 0
        this.ax = this.ay = this.az = 0;
        this.vx = this.vy = this.vz = 0;
        this.px = this.py = this.pz = 0;
    };
    
    Positionometer.prototype.onPositionChange = function(callback) {
        this.callbacks.push(callback);
    };

    Positionometer.prototype.changePosition = function() {
        var i, len;
        for(i = 0, len = this.callbacks.length; i < len; i++) {
            try {
                this.callbacks[i]({
                    x: this.px,
                    y: this.py,
                    z: this.pz
                });
            } catch (e) {
                console.error(e);
            }
        }
    };

    window.Positionometer = new Positionometer();
}());