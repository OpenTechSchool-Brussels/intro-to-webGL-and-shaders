---
layout: default
title:  "Draw & animate your first shape"
num: 3

---

## a) Create your own shape

Now the question is : how to send vertex positions to the vertex shader ? Well, a simple approach would be to send vertices once every frame to the GPU. That's how early OpenGL workekd. But was not very efficient as it costs a lot of data transfer between the CPU memory and the GPU memory. That's why the Vertex Buffer Object (VBO) has been added in mordern OpenGL versions. VBO is a buffer containing vertex informations residing in the GPU memory. That means that you need to upload the vertiex informations to the GPU just once. The vertices will stay there until the VBO is explicitely destroyed by the application. 

During a frame rendering, the vertex shader reads directly the VBO, vertex per vertex, and use it as input attribute.

<img src="./assets/webGLVBODiagram.jpg" alt="VBO diagram">

Let'see how to connect these different pieces together. Comment the function that we will replace :

~~~ JavaScript
//func_3_createTriangle();
~~~

The first thing to do is to define the vertex positions (the data) we want to send to the vertex shader. Before loading crazy models containing thousands of vertices, let's start by writing manually the position of one single triangle :

~~~ JavaScript

// define vertices of our first triangle
var vertexPositionArray=[
    -0.5,-0.5,0, //bottom left
    0.5,-0.5,0, //bottom right 
    0.5,0.5,0,  //top right
];

// this variable will be used later, during the draw call
window.numberOfVertices = 3;
~~~

As a reminder, coordinates go from -1 to 1. window.numberOfVertices is a global variable used in later stage, just before the final draw call, we'll discuss that later. 

We now create a VBO on the GPU with the function createBuffer, and send our triangle positions to it:

~~~ JavaScript

// create an empty buffer object
window.vertexBufferPositionID = GL.createBuffer ();

// bind to the new buffer object 
GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferPositionID);

// send data to the new buffer object
GL.bufferData(GL.ARRAY_BUFFER,
            new Float32Array(vertexPositionArray),
            GL.STATIC_DRAW);
~~~	

The parameter GL.STATIC_DRAW is a hint to OpenGL to indicate that we won't change the data contained in the VBO. 

The vertices of the triangle are now loaded in the VBO and used by the vertex shader every time the scene is rendered. 

You can modify the data you send in the VBO. Add as many triangle you want. Here is a quad formed by 2 triangles :

~~~ JavaScript
// define vertices of a quad
var vertexPositionArray=[
    //----- triangle 1
    -0.5,-0.5,0, //bottom 
    0.5,-0.5,0, //bottom right 
    0.5,0.5,0,  //top right

	//----- triangle 2
    -0.5,0.5,0, //top left
    0.5,0.5,0, // top right
    -0.5,-0.5,0, // bottom left
];

// this variable will be used later, during the draw call
window.numberOfVertices = 6;
~~~


## b) The rendering loop
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

~~~ JavaScript

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

As usual, we first get the location of the variable in the shader with the function getUniformLocation. 
We update it then with the function uniform1f. 

You should obtain a beautiful pink square. 
This color change can be automated. Let's use the current time to change the color periodically. 

~~~ html
var timeSecond = new Date().getTime() / 1000;

var redColorLevel = (Math.sin(timeSecond)+1)*0.5; // -> change periodically with time
var redColorUniformLocation = GL.getUniformLocation(shaderProgramID, "u_redColor");
GL.uniform1f(redColorUniformLocation,redColorLevel);
~~~

The square now changes slowly its color from pink to blue periodically. 

A colored square is cool. But you know what's even cooler ? A rotating color square !
We will modify the square position using a matrix uniform in the vertex shader. 

~~~ html
<script id="firstVshader" type="x-shader/x-vertex">

    attribute vec3 position; 
    uniform mat4 u_transformMatrix;

    void main(void) 
    { 
        gl_Position = u_transformMatrix * vec4(position,1.0);
    }
</script>
~~~

The position (x,y,z,w) is now multiplied by a 4x4 matrix. This allow almost any kind of scale and rotation operations on the positions. What does this matrix contain? 
Let define it in our javascript code :

~~~ JavaScript
var angle = timeSecond*10;
// create a new identity matrix
var transformMatrix = new J3DIMatrix4()
// add rotation around x,y,z 
transformMatrix.rotate(angle,angle*0.3+30,0);
var transformMatrixLocation = GL.getUniformLocation(shaderProgramID, "u_transformMatrix");
// send the matrix to the vertex shader uniform 
GL.uniformMatrix4fv(transformMatrixLocation,false,transformMatrix.getAsFloat32Array());
~~~

We use the library J3DIMath here to get a matrix containing rotation around 3 axes (x,y,z). 
The uniform is then updated using the OpenGL function uniformMatrix4fv.

## d) Send additional vertex informations : colors

For the moment, the color of the triangle is hardcoded and is the same for every pixels. What if we want one color per vertex ? Let's create another VBO that will contain the colors. 

Replace your vertex shader with this code : 


~~~ html
<script id="vshader" type="x-shader/x-vertex">

    attribute vec3 position; 
    attribute vec3 color;

    uniform mat4 u_transformMatrix;

    varying vec3 v_Color;

    void main(void) 
    { 
        // forward the color to the fragment shader
        v_Color = color;
        gl_Position = u_transformMatrix * vec4(position,1.0);
    }

</script>
~~~

We added an input attribute called color, and added an additional v_Color variable that will be passed to the fragment shader. Those outputs are called varying because they are interpolated between the vertices. 

Here is the fragment shader : 

~~~ html

<script id="fshader" type="x-shader/x-fragment">

    precision mediump float;

    // here we declare our uniform
    uniform lowp float u_redColor;
    varying vec3 v_Color;

    void main(void) 
    {
        // the final output is the color received with the varying v_Color
        gl_FragColor = vec4(v_Color,1.0);
    }
</script>

~~~

The varying v_Color must be declared here as well. The final output will be the v_Color augmented with av alpha value. 
The new attribute must be activated, like the position attribute. Add thos two lines  in your javascript code : 

~~~ JavaScript
// get attribute location
var colorAttributeLocation = GL.getAttribLocation(shaderProgramID, "color");
// enable the attribute
GL.enableVertexAttribArray(colorAttributeLocation);
~~~ 

Now let's feed that new input attribute. In the javascript code, just below the vertex position loading, add a vertex color loading. 

~~~ JavaScript

var vertexColorArray=[
    1,0,1, //bottom left
    1,1,1, //bottom right
    1,1,0, //top right
    
    0,0,1, //top left
    1,0,0, // top right
    0,1,0, // bottom left
];

// create an empty buffer object
window.vertexBufferColorID= GL.createBuffer ();

// bind to the new buffer object
GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferColorID);

// send data to the new buffer object
GL.bufferData(GL.ARRAY_BUFFER,
            new Float32Array(vertexColorArray),
            GL.STATIC_DRAW);
~~~

This works exactly like the vertex position buffer : 
* We manually define a data array with our colors (R,G,B)
* We create an empty VBO
* We fill it with our color array

We still need to link our attribute "color" to this new VBO. Let's do this in the draw function. Add this code before the GL.drawArrays call : 

~~~ JavaScript
GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferColorID);
var colorAttibuteLocation = GL.getAttribLocation(shaderProgramID, "color")
GL.vertexAttribPointer(colorAttibuteLocation, numberOfComponents, GL.FLOAT, false,0,0) ;
~~~ 

And now you should obtain a beautiful multicolor quad. Why ? We defined color only four our 6 vertices. And these colors has been interpolated for each pixel drawn in the  triangles defined by these vertices, thanks to the magic "varying" variable. 

<img src="./assets/fragmentInterpolation.jpg" alt="Fragment Interpolation">

That's a fondamuntal concept to understand. The main task of GPU's are fast texture reading and interpolation. 


## e) Controling this mess

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
