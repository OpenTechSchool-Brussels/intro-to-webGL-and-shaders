---
layout: default
title:  "Introduction to Shaders"
num: 2

---


## a) basic concepts of shaders
* glsl language : based on C language
* variable types : float, vec2, vec3
* qualifiers : uniforms, attributes and varyings

~~~ html
<script id="vshader" type="x-shader/x-vertex">
attribute vec3 position; 

void main(void) 
{ 
    gl_Position=vec4(position,1.0);
}
</script>
~~~

~~~
<script id="fshader" type="x-shader/x-fragment">

void main(void) {
    gl_FragColor = vec4(1.0);
}
</script>
~~~

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
var vshaderString = document.getElementById("firstVshader").text
var shaderVertexID=compileShader(vshaderString, GL.VERTEX_SHADER, "VERTEX");

var fshaderString = document.getElementById("firstFshader").text
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
* change the position in the vertex shader
  * translation : use a uniform to add value to x coordinates
  * rotation : use a unifrom to rotate the vertices around (0,0,0). No matrix involved
* change the color in the fragment shader : multiply the rgb color by a uniform
* use of varying : set a uniform representing a color in the vertex shader, pass it through a varying to the fragment shader. Show the interpolation of the color.

## d) Not so related: WebGL Init
* Deal with the last piece of the library, and ditch the import in the header! Yay, you're free!
