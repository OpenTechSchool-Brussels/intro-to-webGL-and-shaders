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
var compile_shader=function(source, type, typeString) 
{
    var shaderID = GL.createShader(type);
    GL.shaderSource(shaderID, source);
    GL.compileShader(shaderID);
    if (!GL.getShaderParameter(shaderID, GL.COMPILE_STATUS)) 
    {
        console.log("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shaderID));
        return false;
    }
    return shaderID;
};
~~~

## c) Little modifications
* change the position in the vertex shader
  * translation : use a uniform to add value to x coordinates
  * rotation : use a unifrom to rotate the vertices around (0,0,0). No matrix involved
* change the color in the fragment shader : multiply the rgb color by a uniform
* use of varying : set a uniform representing a color in the vertex shader, pass it through a varying to the fragment shader. Show the interpolation of the color.

## d) Not so related: WebGL Init
* Deal with the last piece of the library, and ditch the import in the header! Yay, you're free!
