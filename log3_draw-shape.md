---
layout: default
title:  "Draw your first shape"
num: 3

---


* Talk about binding in this page
* Talk about coordinates system (vertice, evocate texture, pixels)


This is madness... You know how to handle your vertex, but you haven't send them yet... Let's take care of that!

## a) Create your own shape

Before sending the vertex to your shader, you need first to decide what they will be. Our job here is to define a set of vertex, amounting to the shape we want to describe. While we define this set in the CPU, we need it to reside in the GPU, for it to become the first step of the graphic pipeline. For that, we'll use a **Vertex Buffer Object** (VBO). A VBO is a buffer, residing in the GPU memory, and containing vertex informations. That means that you need to upload the vertex informations to the GPU just once. The vertices will stay there until the VBO is explicitly destroyed or modified by the application. 

During a frame rendering, the vertex shader reads directly the VBO, vertex per vertex, and use it as input attribute. (Ohhh now we understand where the positions are coming from in the vertex shader).

<img class="ctr" src="./assets/webGLVBODiagram.jpg" alt="VBO diagram" width="800">

Before anything else, delete `func_3_createTriangle();`, this time there won't be any in between functions! Now let's write our own code. First, we'll have to define our geometry, represented by the set of vertice named **data** in the diagram above. For that, we'll define a set of vertex, only holding their position for now. If you remember from last log, such position should be in the [-1, 1] range (when you don't play with depth).

The first thing to do is to define the vertex positions (**data** on the previous diagram) we want to send to the vertex shader. Each position has 3 coordinates : X, Y, Z. The X and Y coordinates go from -1 to 1 as shown below.

<img class="ctr" src="./assets/webGLcoordinate.png" alt="Vertex Coordinates" width="400">

Vertices with position outside of the -[1, 1] rectangle won't appear in your webGL view. The Z axis point toward you: a vertex with negative Z coordinate will be placed *behind* your screen. 

Let's now write each vertex of one humble triangle (in the `setup()` function, where the deleted function was).

~~~ JavaScript

// define vertex positions of our first triangle
var vertexPositionArray = [
    -0.5, -0.5, 0, //bottom left
     0.5, -0.5, 0, //bottom right 
     0.5,  0.5, 0  //top right
];

// While one could easily compute the number of vertice in our shape,
// let's hardcode it here for easier later usage.
numberOfVertices = 3;
~~~

Nothing special here, exept that "window.numberOfVertices" : this is a global variable used in later stage, just before the final draw call, we'll discuss that later. 

We now create a VBO on the GPU with the function GL.createBuffer, and send our position array to it:

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

Every object created on the GPU is accessed in 2 steps from our javascript code : 
* We select an object we want to modify with the function GL.bindBuffer(...)
* We modify the selected object

That's a mechanism used everywhere in OpenGL so get used to it!

The parameter GL.STATIC_DRAW is a hint to OpenGL that indicates that we won't change the data contained in the VBO, it's a static mesh. 

The vertices of the triangle are now loaded in the VBO and used by the vertex shader every time the scene is rendered. As a test, you can modify the data you send in the VBO. Add as many triangles you want. Here is a quad formed by 2 triangles :

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

~~~ JavaScript
// Canvas
window.CANVAS=document.getElementById(canvasId);
CANVAS.width=window.innerWidth;
CANVAS.height=window.innerHeight;

// WebGl Context
try {
	window.GL = CANVAS.getContext("webgl");
} catch (e) {
	alert("You are not webgl compatible :(") ;
	return false;
}
    
GL.clearColor(0.0, 0.0, 0.0, 0.0);

~~~

