//author: Jacob Colby
//date: 3/2/2021
//description: This program incorporates different menu buttons and sliders to control the animation of a shape.
//proposed points (out of 10): 10, I think I did a good job of implementing all of the required parts of this
//                          assignment in an interesting way and made sure to comment what each part does.

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

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    let colors = [
        vec3(1.0, 0.0, 0.0),
        vec3(1.0, 0.0, 1.0),
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 0.0, 0.3)
    ];

    var vertices = [
        vec2(0, 1),
        vec2(-1, 0),
        vec2(1, 0),
        vec2(0, -1)
    ];


    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
    let colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc); 


    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data bufferData

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

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
                colors = [
                    vec3(0.0, 0.0, 1.0),
                    vec3(0.0, 0.0, 1.0),
                    vec3(0.0, 0.0, 1.0),
                    vec3(0.0, 0.0, 1.0)
                ];
                console.log("Color changed to blue.")
                cBuffer = gl.createBuffer();
                gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
                gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
                colorLoc = gl.getAttribLocation(program, "aColor");
                gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(colorLoc);
                break;
            case 1: //Set color to red.
                colors = [
                    vec3(1.0, 0.0, 0.0),
                    vec3(1.0, 0.0, 0.0),
                    vec3(1.0, 0.0, 0.0),
                    vec3(1.0, 0.0, 0.0)
                ];
                console.log("Color changed to red.")
                cBuffer = gl.createBuffer();
                gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
                gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
                colorLoc = gl.getAttribLocation(program, "aColor");
                gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(colorLoc);
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
                
                let colorLoc = gl.getAttribLocation(program, "aColor");
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