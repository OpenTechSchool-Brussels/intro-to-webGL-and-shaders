---
layout: default
title:  "Graphic Pipeline"
num: 1

---

## Pipeline Overview

* Vertex
  * What data are contained in a 3D mesh : introduce the concept of triangles and vertex
* Vertex Shader
  * Vertex Coordinates
  * Example with a triangle
* Rasterization
* Fragment Shader
  * Fragment Coordinates
* (Z-Buffering)
* (Blending)

## First look at our render library
Map each step of the rendering pipeline to a function of the library


~~~ JavaScript
var main=function() {
    
  // You set up everything
  func_1_initialisation();
  func_2_createShader();    
  func_3_createTriangle();

  // You play with and animate it
  func_4_animate();
  
};
~~~
