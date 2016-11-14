---
layout: default
title:  "Textures"
num: 4

---


## a) Create a texture and upload it on the GPU

* Texture generation
* Parameters of the texture : interpolation , wrapping
* load the image in the texture with glTexImage2D

## b) Use the texture in the shaders

* send texture coordinates as attributes
* modify glVertexAttribPointer accodingly
* get the texture coordinates in the vertex shader and pass it to the fragment shader with a varying
* sample the texture and display the right color in the fragment shader

## c) Mapping textures



## d) Using a second textures as tool
* generate a second texture
* set a second texture uniform and set the right texture unit (not needed previously because by default texuteUnit = 0)
* use the second texture as displacement map (?)

ref: https://open.gl/textures
