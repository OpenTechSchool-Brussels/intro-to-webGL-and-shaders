---
layout: default
title:  "Introduction to Shaders"
num: 2

---

## What again is a shader?

A shader is program that will be executed on your graphic card. It working on the GPU instead of the CPU implies a few change in behavior. First, you'll need to upload your compiled code on the GPU. Second, depending on the kind of shader, it'll be executed at a specific moment in the graphic pipeline as you've read about in the previous log. Second, your program won't be executed *once* as when on your CPU, but multiple times, in parallel. For instance, your vertex shader will be executed in parallel for each vertex, and your fragment shader for each fragment. This hardware-based parallelization is what makes the GPU particularly fit to process & render graphics.

In order for things to flow through the pipelines, you must provide both shaders. This is was done implicitly in the second function `func_2_createShaders()`. Now in order to regain some more control, we're going to get rid bits by bits of this function and write our own shaders.


## The vertex shader
Let's do things in order and begin with the vertex shader. You have many ways and places to write the shader, the easiest we found was to put it back in the HTML, between some script tags. We will add a specific id (*vshader* in our case) in order to refer easily to it, and specify its type. The code below should be put between the body tag in your HTML code (not the JavaScript one).

~~~ html
<script id="vshader" type="x-shader/x-vertex">

// Your shader code will be here

</script>
~~~


Now if you continue using `func_2_createShaders()`, you won't be referring to the shader you're about to write. To do so, you'll replace this function with `func_2bis_createShadersWithVertexShaderFromHTML()` in your JavaScript code. Now have control over the shader. Bad news. You're now going to code in a different language. It being the OpenGL Shading Language (little name: GLSL). Good news. It's actually pretty close to what you've been doing until now. The main difference is that whereas JavaScript defines all variables with *var*, GLSL makes you specify in its definition the type of the variable (scalar, vectors, arrays...).


~~~ html
<script id="vshader" type="x-shader/x-vertex">
attribute vec3 position; 

void main(void) 
{ 
    gl_Position=vec4(position,1.0);
}
</script>
~~~


* Little modifications to play with




## The fragment shader
 var func_2ter_createBothShadersFromHTML = function() {





## Compiling your shaders

* not using func_2bis anymore

## Modification on your shader (based with the mouse ? introduction of other parametres)

* Bigger modifications ?

## On a completely different note...
* initialisation of the setup









------------------------



## a) basic concepts of shaders

Shaders are little piece of code executed in parallel by the GPU cores. The vertex shaders are executed once every vertex. The fragment shaders are executed once every pixel. As graphic cards can contain thousands of cores (the NVidia GTX 1080 contains 2560 cores for example), the parellel execution of the shaders is incredebly efficient.

OpenGL shaders are written in GLSL, a language based on the syntax of C programming language. Functions behave like C functions. The main() function is a special function that will be called on every vertex/pixel. 

Native types are limited to
*float : 32 floating point variables
*vec2,vec3,vec4 : vectors of floating point. The component of a vector can be acessed with the suffixes
** .x, .y, .z, .w for geometric variables
** .r, .g, .b, .a for color variables

The input of the vertex shader is called "attribute". The value of the attribute is attached to the vertex currently processed. It can be a position, a color, or anything else, as we will see.

Shaders are juste text and can be written anywhere. We use here an html tag "script" with a custom type "x-shader/x-vertex", but the code could have been directly written in a javascript string, or in a separate .txt file. 

Here is our first vertex shader. Insert it on top of the main javascript script tag. 

~~~ html
<script id="vshader" type="x-shader/x-vertex">
attribute vec3 position; 

void main(void) 
{ 
    gl_Position=vec4(position,1.0);
}
</script>
~~~

This shader get the vertex position as input attribute. The output of the vertex shader is the variable gl_Position. It represents the position of the current vertex after beeing transformed by the shader. Here the output is simply the position vector completed by a 4th component. 

Now let's look at our fragment shader : 

~~~
<script id="fshader" type="x-shader/x-fragment">

void main(void) {
    gl_FragColor = vec4(1.0);
}
</script>
~~~

Like the vertex shader, the fragment shader has a special variable, gl_FragColor, used as output. gl_FragColor is a vec4 variable representing R,G,B,A color of the current pixel. 

In this case, the output will be a white pixel (vec4(1.0) is a shortcut notation for vec4(1.0,1.0,1.0,1.0)). 

As a reminder, this code is executed for every pixels. Be careful when you write complex function in the fragment shader. The rendering performance quickly decrease when heavy operation are calculated thousands times per frame. 


## b) Compilation

Shaders must be compiled and linked in a shader program, an executable binary code stored on the GPU memory. The GLSL compiler is built in the OpenGL library and can be called in webGL/javascript code. 

We first write a generic function that we will use to compile our vertex shader and our fragment shader separetely. Add that function below the javascript main() function. 

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

This function returns an OpenGL id to a shader object if the compilation succeeds. Otherwise an error message will be printed in the console. 

Now we can get the text of the shaders written previsousely, with the function getElementById() and send them our new compileShader function. Replace the call to function func_2_createShaders() by this :

~~~ JavaScript

var vshaderString = document.getElementById("vshader").text
var shaderVertexID = compileShader(vshaderString, GL.VERTEX_SHADER, "VERTEX");

var fshaderString = document.getElementById("fshader").text
var shaderFragmentID = compileShader(fshaderString, GL.FRAGMENT_SHADER, "FRAGMENT");

~~~

We get two shader objects (represented by shaderVertexID and shaderFragmentID) that we must combine in a program object : 

~~~ JavaScript

//creates an empty program object
window.shaderProgramID=GL.createProgram();

//attach shaders to the program
GL.attachShader(shaderProgramID, shaderVertexID);
GL.attachShader(shaderProgramID, shaderFragmentID);

//link the program
GL.linkProgram(shaderProgramID);

~~~

The GL.createProgram function creates an empty program object that we fill with our two shader objects. 

The last thing we need to do is to enable the input attribute : 

~~~ JavaScript
//get position attribute location in the shader
var positionAttributeLocation = GL.getAttribLocation(shaderProgramID, "position");

// enable the attribute
GL.enableVertexAttribArray(positionAttributeLocation);

~~~

Variables in shaders are accessed with indirect index numbers called "location". To enable an attribute, we first get its location and then call enableVertexAttribArray on it. 

The application now use your shader program instead of the library one. So let's play with it !

## c) Little modifications

The main purpose of the vertex shader is to modify the position of the vertices. So if you add constant to the position input, you should see the triangle move to the top-right of the screen. 

~~~ html
<script id="firstVshader" type="x-shader/x-vertex">
    attribute vec3 position; 

    void main(void) 
    { 
        // modification of the position
        vec3 modifiedPosition;
        modifiedPosition.x = position.x+0.3;
        modifiedPosition.y = position.y+0.2;
        modifiedPosition.z = position.z;

        gl_Position = vec4(modifiedPosition,1.0);
    }
</script>

~~~

The fragment shader can modify the colors of the current pixel. Let's display a light blue pixels : 

~~~ html
<script id="firstFshader" type="x-shader/x-fragment">
    
    void main(void) {
        // output blue color
        gl_FragColor = vec4(0.3,0.6,0.9,1.0);
    }
</script>

~~~


## d) Not so related: WebGL Init
* Deal with the last piece of the library, and ditch the import in the header! Yay, you're free!
