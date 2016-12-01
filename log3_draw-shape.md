---
layout: default
title:  "Draw your first shape"
num: 3

---


* Talk about binding in this page
* Talk about coordinates system (vertice, evocate texture, pixels)


## a) Create your own shape

Now the question is : how to send vertex positions to the vertex shader ? Well, a simple approach would be to send vertices once every frame to the GPU. That's how early versions of OpenGL worked. But was not very efficient as it costs a lot of data transfer between the CPU memory and the GPU memory. That's why the Vertex Buffer Object (VBO) has been added in modern OpenGL versions. VBO is a buffer, residing in the GPU memory, and containing vertex informations. That means that you need to upload the vertex informations to the GPU just once. The vertices will stay there until the VBO is explicitely destroyed by the application. 

During a frame rendering, the vertex shader reads directly the VBO, vertex per vertex, and use it as input attribute.

<img src="./assets/webGLVBODiagram.jpg" alt="VBO diagram" width="600">

Let see how to connect these different pieces together. Comment the function that we will replace with our own code:

~~~ JavaScript
//func_3_createTriangle();
~~~

The first thing to do is to define the vertex positions (the data) we want to send to the vertex shader. Before loading crazy models containing thousands of vertices, let's start by writing manually the position of one humble triangle :

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

We now create a VBO on the GPU with the function createBuffer, and send our position array to it:

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

As a test, you can modify the data you send in the VBO. Add as many triangle you want. Here is a quad formed by 2 triangles :

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


## d) Not so related: WebGL Init
* Deal with the last piece of the library, and ditch the import in the header! Yay, you're free!

