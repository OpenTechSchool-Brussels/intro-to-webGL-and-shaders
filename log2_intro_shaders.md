---
layout: default
title:  "Introduction to Shaders"
num: 2

---


## a) basic concepts of shaders

Shaders are little piece of code executed in parallel by the GPU cores. The vertex shaders are executed once every vertex. The fragment shaders are executed once every pixel. On high end graphic card, the number of cores can goes up to 2560 (for the NVidia GTX 1080). The parellel execution on these cores make shaders incredebly efficient.

OpenGL shaders are written in GLSL, a language based on the syntax of C programming language. Functions behave like C functions. The main() function is a special function that will be called on every vertex/pixel. 

Native types are limited to
* float : 32 floating point variables
* vec2,vec3,vec4 : vectors of floating point. The component of a vector can be acessed with the suffixes
** .x, .y, .z, .w for geometric variables
** .r, .g, .b, .a for color variables

The input of a vertex shader is called "attribute". That's a value attached to the vertex currently processed. It can be a position, a color, or anything else. 
The output of the vertex shader is the variable gl_Position. It represents the position of the current vertex after beeing transformed by the shader. 

Here is our first vertex shader : 

~~~ html
<script id="vshader" type="x-shader/x-vertex">
attribute vec3 position; 

void main(void) 
{ 
    gl_Position=vec4(position,1.0);
}
</script>
~~~

This shader get a position as input attribute. The output is simply this position completed by a 4th component. 

Here is our first fragment shader : 

~~~
<script id="fshader" type="x-shader/x-fragment">

void main(void) {
    gl_FragColor = vec4(1.0);
}
</script>
~~~

Like in the vertex shader, the fragment shader has a special variable (gl_FragColor) used as output. gl_FragColor is a vec4 variable representing R,G,B,A color of the current pixel. 

Here the output will be a white pixel (vec4(1.0) is a shortcut notation for vec4(1.0,1.0,1.0,1.0)). 

## b) Compilation

~~~ JavaScript

function compileShader(source, type, typeString) 
{
    //creates an empty shader object
    var shaderID = GL.createShader(type);

    // sets the source code in shader
    GL.shaderSource(shaderID, source);

    // compile the shader object
    GL.compileShader(shaderID);

    if (!GL.getShaderParameter(shaderID, GL.COMPILE_STATUS)) 
    {
        console.log("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shaderID));
        return false;
    }
    return shaderID;
};

~~~

~~~ JavaScript

var vshaderString = document.getElementById("vshader").text
var shaderVertexID=compileShader(vshaderString, GL.VERTEX_SHADER, "VERTEX");

var fshaderString = document.getElementById("fshader").text
var shaderFragmentID=compileShader(fshaderString, GL.FRAGMENT_SHADER, "FRAGMENT");

//creates an empty program object
window.shaderProgramID=GL.createProgram();

//attach shaders to the program
GL.attachShader(shaderProgramID, shaderVertexID);
GL.attachShader(shaderProgramID, shaderFragmentID);

//link the program
GL.linkProgram(shaderProgramID);

//get position attribute location in the shader
var colorAttributeLocation = GL.getAttribLocation(shaderProgramID, "color");
var positionAttributeLocation = GL.getAttribLocation(shaderProgramID, "position");

// enable the attribute
GL.enableVertexAttribArray(colorAttributeLocation);
GL.enableVertexAttribArray(positionAttributeLocation);

~~~

## c) Little modifications

~~~ html
<script id="firstVshader" type="x-shader/x-vertex">
    attribute vec3 position; 

    void main(void) 
    { 
        // modification of the position
        vec3 modifiedPosition;
        modifiedPosition.x = position.x+0.3;
        modifiedPosition.y = position.y-0.2;
        modifiedPosition.z = position.z;

        gl_Position = vec4(modifiedPosition,1.0);
    }
</script>

~~~

~~~ html
<script id="firstFshader" type="x-shader/x-fragment">
    
    void main(void) {
        // output blue color
        gl_FragColor = vec4(0.3,0.6,0.9,1.0);
    }
</script>

~~~


* change the position in the vertex shader
  * translation : use a uniform to add value to x coordinates
  * rotation : use a unifrom to rotate the vertices around (0,0,0). No matrix involved
* change the color in the fragment shader : multiply the rgb color by a uniform
* use of varying : set a uniform representing a color in the vertex shader, pass it through a varying to the fragment shader. Show the interpolation of the color.

## d) Not so related: WebGL Init
* Deal with the last piece of the library, and ditch the import in the header! Yay, you're free!
