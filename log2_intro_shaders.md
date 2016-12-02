---
layout: default
title:  "Introduction to Shaders"
num: 2

---

## What again is a shader?

A shader is program that will be executed on your graphic card. Working on the GPU instead of the CPU implies a few change in behavior. First, you'll need to upload your compiled code on the GPU. Second, your program won't be executed *once* as when on your CPU, but multiple times, in parallel. For instance, your vertex shader will be executed in parallel for each vertex, and your fragment shader for each fragment. This hardware-based parallelization is what makes the GPU particularly fit to process & render graphics.

In order for things to flow through the pipelines, you must provide both shaders. This is was done implicitly in the second function `func_2_createShaders()`. Now in order to regain some more control, we're going to get rid bits by bits of this function and write our own shaders.


## The vertex shader
Let's do things in order and begin with the vertex shader. You have many ways and places to write the shader, the easiest we found was to put it back in the HTML, between some script tags. We will add a specific id (*vshader* in our case) in order to refer easily to it, and specify its type. The code below should be put in the header of your HTML code.

~~~ html
<script id="vshader" type="x-shader/x-vertex">

// Your vertex shader code will be here

</script>
~~~

Now if you keep on using `func_2_createShaders()`, you won't be referring to the shader you're about to write. To do so, you'll need to replace this function with `func_2bis_createShadersWithVertexShaderFromHTML()` in your JavaScript code. Now have control over the shader. Bad news. You're now going to code in a different language. It being the OpenGL Shading Language (little name: GLSL). Good news. It's actually pretty close to what you've been doing until now.

On of the main difference with classic JavaScript is how you handle variables. Before, you just wrote `var` and it was enough. Now you know to specify the type of the variable (how the data should be read: is it a vector, a scalar, an array...) and the type qualifier of the variable (how the data behave: is it an input, an output, a parameter...). 

You'll learn about different type and type qualifier along the way but here is a bit of a head start. Type wise, you have scalars (`float`) and vectors of different dimensions (`vec2`, `vec3`, `vec4`). 

The input of the vertex shader is called **attribute**. The value of the attribute is attached to the vertex currently processed. It can be a position, a color, or anything else, as we will see.

In our vertex shader case, the shader needs to get the vertex position as input attribute. The output of the vertex shader will the variable gl_Position that represents the position of the current vertex after being transformed by the shader. Here the output is simply the position vector completed by a 4th component.

~~~ html
<script id="vshader" type="x-shader/x-vertex">
attribute vec3 position; 

void main(void) 
{ 
    gl_Position=vec4(position,1.0);
}
</script>
~~~

This is nice, but here you're just passing along the information you just received. Let's define and operate a translation in order to move a bit the triangle.


~~~ html
<script id="vshader" type="x-shader/x-vertex">
    attribute vec3 position; 

    void main(void) 
    { 
        // modification of the position
        vec3 moveBy;
        moveBy.x = 0.3;
        moveBy.y = 0.2;
        moveBy.z = 0.0;

        gl_Position = vec4(position + moveBy,1.0);
    }
</script>
~~~

At first, you might think that `0.3` is a pretty small value for a translation. At a second glance, you might wonder ... `0.2` what? O.2 meters? 0.2 miles? 0.2 pixel? For each value to make sense, you need to understand how they relate to their grid: the coordinate systems. In our case, we map our screen in [-1, 1]. This means that if we don't play with depth (z=0), then (-1,-1) will be our bottom left corner  of the screen, and (1,1) the top right corner.


## The fragment shader

Well, it's time now to apply all we learned to the fragment shader. Different aim, similar tools. We'll have similar fragment shader code in HTML, so to use it, we need to change (again) the second function. Now it'll be `func_2ter_createBothShadersFromHTML();`. Speaking about shader code in the HTML, we need to create a similar holding place in the HTML file for this shader. And last, the fragment shader needs to output a color (the one of the pixel), which is represented by the output variable `gl_FragColor`. It is a vector of 4 dimensions (red, blue, green, alpha / transparency) with values between 0 and 1. In order to get keep our white triangle, we'll maximise each value.

~~~
<script id="fshader" type="x-shader/x-fragment">

void main(void) {
    // output with format (Red, Green, Blue, Alpha)
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
</script>
~~~

Ta-dah. 

So, the fragment shader defines the colors of the current pixel. Any idea how to display a light blue pixel? you just need to change the value of the vector you're feeding `gl_FragColor`. Fiddle a bit with it, and if you're too lazy, you can just try with `vec4(0.3, 0.6, 0.9, 1.0)`.

All is good and well, but life should not be so dull. Want something more? Well, you'll see many ways to have more varying colors, but let's use a little hack. You've already met `gl_FragColor` and `gl_Position`. These are built in variables, meant to be used as output. You have many other built in variables (specific to each shaders). One of them is `gl_FragCoord`, which describe the position of the fragment on screen. Try to think of a way to use that vector in order to have different colors output. Below is a proposed exploration.

~~~ html
<script id="fshader" type="x-shader/x-fragment">    
    void main(void) {
        gl_FragColor = vec4(gl_FragCoord.x / 1000, 0.0 , 1 - gl_FragCoord.y / 1000, 1.0);
    }
</script>
~~~

Now, all is good and fun but ... we're still dealing with that annoying second function, and its name is getting way out of hand. Let's just get rid of it, okay? For that, we need to understand what it does. We already know a little bit. It takes both shaders we have coded and make the GPU use them in the graphic pipeline. Let's see how it does that.


## Compiling your shaders

Now, all is good and fun but ... we're still dealing with that annoying second function, and its name is getting way out of hand. Let's just get rid of it, okay? For that, we need to understand what it does. We already know a little bit. It takes the shader code we're 


* not using func_2bis anymore


Shaders must be compiled and linked in a shader program, an executable binary code stored on the GPU memory. The GLSL compiler is built in the OpenGL library and can be called in webGL/javascript code. 

We first write a generic function that we will use to compile our vertex shader and our fragment shader separately. Add that function below the javascript main() function. 

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

Now we can get the text of the shaders written previously, with the function getElementById() and send them our new compileShader function. Replace the call to function func_2_createShaders() by this :

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
Aaaand we get our triangle back on the output view ! 

## Time and Randomness
