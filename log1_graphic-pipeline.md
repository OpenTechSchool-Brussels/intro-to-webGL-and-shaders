---
layout: default
title:  "Graphic Pipeline"
num: 1

---

## Pipeline Overview

In modern 3D computer graphics, every object appearing on screen is usually based on triangle geometry. 

Even a complex scene like this one : 

//image full rendering

... is in fact based on a set of triangles augmented with shading and post processing effects : 

// image mesh

Why triangles ? Because they are easy to process by the GPU, because they are flexible enough and can approximate a wide range of 3D surfaces. A triangle is a simple universal surface element. 

The points composing a triangle are called "vertices" (plural form of "vertex"). The set of vertices, edges, and faces that compose a 3D object is called a 3D mesh. 

// image dolphin mesh

So how to move from a barbone 3D mesh to a beatiful texturerd post-processed scene ? 

Let's talk about the GRAPHIC PIPELINE. 

Every frame of an OpenGL application is rendered following these steps : 

![gras](assets/images/webGLPipeline.jpg)

Vertices are contained in a buffer on the GPU. At this stage it's only a set of information per 3D point (position, color etc ...). 

These vertices are modified in the programmable vertex shader. The operations performed in the vertex shader usually include rotation, scale, and translation on the positions. This allows to "place" the points of the mesh in a 3D world. 

After these vertex transformations, the renderer will form triangles out of the list of vertex positions. This step can be configured to alternatively form lines or points. We will stick here to the triangle case. 

At this point we just have abstract triangles defined in an abstract coordinate system. It's time to convert that into real pixels! Or more precisely into fragment, a temporary pixel that still has to pass several test to earn the right to be displayed. The job of the rasterizer is to determine which frament is contained in the triangle. 

The programmable fragment shader will run for every fragments defined in the rasterization process, allowing to choose what will be the final color of the fragment. It will depend on textures, fragment position, external parameters etc ...

The final step is to discard fragments that don't pass visibility tests. One of these test is the (optional) depht test : if one triangle is obscured by another triangle, the fragment of the closer triangle should end up on the screen. The survivors of these tests are finally called pixels. We finally got them !


## OpenGL state machine

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
