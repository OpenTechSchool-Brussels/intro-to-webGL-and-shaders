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

You'll learn about different type and type qualifier along the way but here is a bit of a head start. Type wise, you have (among others) scalars (`float`) and vectors of different dimensions (`vec2`, `vec3`, `vec4`). Type qualifier wise, we'll for now only learn how to define inputs (called `attribute`). This is very important since we already need that. In order to work as expected, our vertex shader requires each vertex's position as input.

At the other end, we have outputs. In our vertex shader one outputs is the variable `gl_Position` that represents the position of the current vertex after being transformed by the shader. Here the output is simply the position vector completed by a 4th component.

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

    void main(void) { 
        // The definition of the translation
        vec3 moveBy;
        moveBy.x = 0.3;
        moveBy.y = 0.2;
        moveBy.z = 0.0;

        gl_Position = vec4(position + moveBy, 1.0);
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

All is good and well, but life should not be so dull. Want something more? Well, you'll see many ways to have more varying colors, but let's use a little hack. You've already met `gl_FragColor` and `gl_Position`. These are built in variables, meant to be used as output. You have many other built in variables (specific to each shaders). One of them is `gl_FragCoord`, which describe the position of the fragment. It's a bit more complex than that but for now we'll use it as a shortcut to mess with colors.

~~~ html
<script id="fshader" type="x-shader/x-fragment">    
    void main(void) {
        // The definition of our color
        vec4 myColor;
        myColor.r = gl_FragCoord.x / 1000.0;
        myColor.g = 0.0;
        myColor.b = 1 - gl_FragCoord.y / 1000.0;
        myColor.a = 1.0;
        
        gl_FragColor = myColor;
    }
</script>
~~~

Now, all is good and fun but ... we're still dealing with that annoying second function, and its name is getting way out of hand. Let's just get rid of it, okay? For that, we need to understand what it does. We already know a little bit. It takes both shaders we have coded and make the GPU use them in the graphic pipeline. Let's see how it does that.


## Compiling your shaders

For shaders to be used by the GPU, we first need to access the text defined in the HTML, then we compile that code and then linked both in a shader program (an executable binary code stored on the GPU memory). Lucky us, we can do all that from JavaScript.


Since the compilation part will be repeated for both shader, let's create a function for that batch of code. It will get as input your shader code, its type, and a debug text to help you along the way. The comments linked with the code should make it self explanatory, but in any case let's not dwell for too long on this part.


If your shader is legit, this functions will return a WebGL ID linked with a shader object. Now we need to get our shader code from the HTML tags in order to feed that function. A bit of DOM, a bit of magic, and here we are.

~~~ JavaScript

var vShaderString = document.getElementById("vshader").text
var vShaderId = compileShader(vshaderString, GL.VERTEX_SHADER, "VERTEX");

var fShaderString = document.getElementById("fshader").text
var fShaderId = compileShader(fshaderString, GL.FRAGMENT_SHADER, "FRAGMENT");

~~~

We now have two shader objects, one for the vertex shader (vShaderId) and one for the fragment shader (fShaderId). We must combine them together in a shader program so we can send it to the GPU.

~~~ JavaScript

//creates an empty program object
shaderProgramId = GL.createProgram();

//attach shaders to the program
GL.attachShader(shaderProgramId, vShaderId);
GL.attachShader(shaderProgramId, fShaderId);

//link the program
GL.linkProgram(shaderProgramId);

~~~

Last but not least, we said in the vertex shader that we needed each vertex position as an input. While we'll see later in the code where we define that variable, we need already here to make it accessible. Variables in shaders are accessed with indirect index numbers called "location", so to make them accessible we just need to get its location and then enable the attribute.

~~~ JavaScript
//get position attribute location in the shader
var positionAttributeLocation = GL.getAttribLocation(shaderProgramID, "position");

// enable the attribute
GL.enableVertexAttribArray(positionAttributeLocation);

~~~

Now the only thing left to do is to delete the line where we called the `func2_....` function, and ... nothing changed. Which is good news: got rid of one of the four functions!

## Time and Randomness
