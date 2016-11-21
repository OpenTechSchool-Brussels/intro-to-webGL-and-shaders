---
layout: default
title:  "Introduction to Shaders"
num: 2

---


## a) basic concepts of shaders
* glsl language : based on C language
* variable types : float, vec2, vec3
* qualifiers : uniforms, attributes and varyings

## b) Compilation
* the function we have already (change "alert" to "console.log" or something)

## c) Little modifications
* change the position in the vertex shader
  * translation : use a uniform to add value to x coordinates
  * rotation : use a unifrom to rotate the vertices around (0,0,0). No matrix involved
* change the color in the fragment shader : multiply the rgb color by a uniform
* use of varying : set a uniform representing a color in the vertex shader, pass it through a varying to the fragment shader. Show the interpolation of the color.

## d) Not so related: WebGL Init
* Deal with the last piece of the library, and ditch the import in the header! Yay, you're free!
