//author: Jacob Colby
//date: 3/2/2021
//description: This program incorporates different menu buttons and sliders to control the animation of a shape.
//proposed points (out of 10): 10, I think I did a good job of implementing all of the required parts of this
//                          assignment in an interesting way and made sure to comment what each part does.

// Pressing 'R' sets the vertice colors to a random RGB to give a different gradient each time.
// Pressing 'S' sets the speed to 0 to stop it's rotation completely.
"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var speed = 0.1;
var direction = true;
var i = 1;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );


    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0); //Light Gray Color

    //  Load shaders and initialize attribute buffers.
    //  Red square vertex shader.
    var programR = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(programR);

    let colorsR = [
        vec3(1.0, 0.0, 0.0),
        vec3(1.0, 0.0, 0.0),
        vec3(1.0, 0.0, 0.0),
        vec3(1.0, 0.0, 0.0)
    ];

    var verticesR = [
        vec2(0, 1),
        vec2(-1, 0),
        vec2(1, 0),
        vec2(0, -1)
    ];


    let cBufferR = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferR );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsR), gl.STATIC_DRAW );
    
    let colorLocR = gl.getAttribLocation(programR, "aColor");
    gl.vertexAttribPointer(colorLocR, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocR); 

    //  Blue square vertex shader.
    var programB = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(programB);

    let colorsB = [
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 0.0, 1.0)
    ];

    var verticesB = [
        vec2(0, 1),
        vec2(-1, 0),
        vec2(1, 0),
        vec2(0, -1)
    ];


    let cBufferB = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferB );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsB), gl.STATIC_DRAW );
    
    let colorLocB = gl.getAttribLocation(programB, "aColor");
    gl.vertexAttribPointer(colorLocB, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocB); 


    // Load the data into the GPU

    var bufferIdB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdB);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesB), gl.STATIC_DRAW);

    var bufferIdR = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdR);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesR), gl.STATIC_DRAW);

    // Associate out shader variables with our data bufferData

    var positionLoc = gl.getAttribLocation(programR, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(programR, "uTheta");

    var positionLoc = gl.getAttribLocation(programB, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(programB, "uTheta");

    //Button
    document.getElementById("button").onclick = function() {
        console.log(i + " Button Press");
        i = i +1;
        direction = !direction;
    }
    //Slider
    document.getElementById("slider").onchange = function(event) {
        speed = parseFloat(event.target.value);
        console.log("Slider Speed: ", speed)
    }
    //Menu
    document.getElementById("Controls").onclick = function(event) {
        switch(event.target.index){
            case 0: //Set color to blue.
                gl.bindBuffer( gl.ARRAY_BUFFER, cBufferB );
                gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsB), gl.STATIC_DRAW );
                gl.vertexAttribPointer(colorLocB, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(colorLocB);
                console.log("Color changed to blue.")
                break;
            case 1: //Set color to red.
                gl.bindBuffer( gl.ARRAY_BUFFER, cBufferR );
                gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsR), gl.STATIC_DRAW );
                gl.vertexAttribPointer(colorLocR, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(colorLocR);
                console.log("Color changed to red.")
                break;
            case 2: //Increase speed by 0.05, max of 0.4.
                    if (speed < 0.4) {
                        speed += .05;
                    }
                    console.log("Speed increased.");
                    console.log(speed);
                    break;
            case 3: //Increase speed by 0.05, minimum of 0.
                if (speed > .1){
                    speed -= .05;
                } else {
                    speed = 0;
                }
                console.log("Speed decreased.");
                console.log(speed);
                break;
        }
    }
    //Key Controls
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
            case 'S': //Stop
            case 's':
                speed = 0;
                break;
            case 'R': //Random colors.
            case 'r':
                let colors = [
                    vec3(Math.random(), Math.random(), Math.random()),
                    vec3(Math.random(), Math.random(), Math.random()),
                    vec3(Math.random(), Math.random(), Math.random()),
                    vec3(Math.random(), Math.random(), Math.random())
                ];
                let cBuffer = gl.createBuffer();
                gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
                gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
                
                let colorLoc = gl.getAttribLocation(programR, "aColor");
                gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(colorLoc); 

        }
    }
    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (direction == true) {
        theta -= speed; //Change the sign from "+=" to "-=" to switch rotation direction. Change the value for rotation speed.
    } else {
        theta += speed;
    }
    gl.uniform1f(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}