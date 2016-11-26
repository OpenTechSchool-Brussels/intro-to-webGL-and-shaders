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
~~	

* re Draw your first Triangle
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
