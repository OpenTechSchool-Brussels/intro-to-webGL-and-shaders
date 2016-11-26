---
layout: default
title:  "Draw & animate your first shape"
num: 3

---

## a) Create your own shape
* Vertex Buffer Object

We will now replace this function call

~~~ JavaScript
func_3_createTriangle();
~~~

by custom code.

* re Draw your first Triangle

~~~ JavaScript

// define vertices of our first triangle
var vertexPositionArray=[
    //----- face 1
    -0.5,-0.5,0, //bottom 
    0.5,-0.5,0, //bottom right 
    0.5,0.5,0,  //top right
];


// create an empty buffer object
window.vertexBufferPositionID = GL.createBuffer ();

// bind to the new buffer object 
GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferPositionID);

// send data to the new buffer object
GL.bufferData(GL.ARRAY_BUFFER,
            new Float32Array(vertexPositionArray),
            GL.STATIC_DRAW);
~~~	


* Change your triangle to another shape(s)

~~~ JavaScript
// define vertices of a quad
var vertexPositionArray=[
    //----- face 1
    -0.5,-0.5,0, //bottom 
    0.5,-0.5,0, //bottom right 
    0.5,0.5,0,  //top right

    -0.5,0.5,0, //top left
    0.5,0.5,0, // top right
    -0.5,-0.5,0, // bottom left
];

// this variable will be used later, during the draw call
window.numberOfVertices = 6;
~~~


## b) Render your shape
* Animate function and its inner working

* fonction animate (glDraw) avec variation du type de Draw (GL_TRIANGLES, GL_LINE_LOOP , etc)

~~~ Javascript

function draw() 
{
    // use the shader we defined earlier
    GL.useProgram(shaderProgramID);

    // define the size of the view
    GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);

    // clear the color buffer
    GL.clear(GL.COLOR_BUFFER_BIT);

    var numberOfComponents = 3

    // link our vertex buffer to the shader attribute position
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferPositionID); // -> next draw will use that buffer
    var positionAttibuteLocation = GL.getAttribLocation(shaderProgramID, "position");
    GL.vertexAttribPointer(positionAttibuteLocation, numberOfComponents, GL.FLOAT, false,0,0) ;
    
    GL.drawArrays(GL.TRIANGLES, 0, window.numberOfVertices);

    window.requestAnimationFrame(draw);
};
~~~

Don't forget to call this function and comment the old one
~~~ Javascript

//func_4_draw();
draw();

~~~

## c) Animating your shape

Now it would be interesting to change the position and the colors from our javascript code. 
Uniforms are variables of which value is constant for every vertex or fragment. 
Let's control the red color component with a uniform. In our fragment shader, we will have

~~~ html
<script id="firstFshader" type="x-shader/x-fragment">
    
    // here we declare our uniform
    uniform float u_redColor;

    void main(void) {
        // output color controlled by a uniform
        gl_FragColor = vec4(u_redColor,0.6,0.9,1.0);
    }
</script>

~~~

Setting the value of a uniform is almost straightforward (at least in OpenGL standard!)

~~~ html
// update uniforms
var redColorLevel = 1.0;
var redColorUniformLocation = GL.getUniformLocation(shaderProgramID, "u_redColor");
GL.uniform1f(redColorUniformLocation,redColorLevel);
~~~

As usual, we get first the location of the variable in the shader with the function getUniformLocation. 
We update it then with the function uniform1f. 

You should obtain a beautiful pink square. 
This color change can be automated. Let's use the current time to set the color periodically. 

~~~ html
var timeSecond = new Date().getTime() / 1000;

var redColorLevel = (Math.sin(timeSecond)+1)*0.5; // -> change periodically with time
var redColorUniformLocation = GL.getUniformLocation(shaderProgramID, "u_redColor");
GL.uniform1f(redColorUniformLocation,redColorLevel);
~~~

The square now changes slowly its color from pink to blue periodically. 

* rotation's mathematical aspect
* operation on vertex buffer each time in animate (say it's "working but ugly" and we'll see better soon)

## d) Controling this mess

* Using the mouse position (x and y) as a control for other stuff

Based on:

~~~ HTML
<div onmousemove="showCoords(event)"></div>
<script>
function showCoords(event) {
    var x = event.clientX;
    var y = event.clientY;
    console.log("X coords: " + x + ", Y coords: " + y);
}
</script>
~~~

## d) Let's do a cube!
* triangles to cube. Simple. Nice. Good for your health
