---
layout: default
title:  "There shall be light"
num: 

---

Let's add a simple light calculation based on an additional attribute : the normals.

Vertex Shader : 
~~~ html
<script id="vshader" type="x-shader/x-vertex">

attribute vec3 position;
attribute vec3 color;
attribute vec2 texureCoordinates;

// we declare a new input attribute : the texture coordinates
attribute vec3 normal;

uniform mat4 u_transformMatrix;

varying vec2 v_textureCoordinates;
varying vec3 v_Color;

// light value sent to the fragment shader
varying float v_lightLevel;

void main(void) 
{ 

    // light position
    vec3 lightPosition = vec3(0,0,100);

    v_textureCoordinates = texureCoordinates;
    v_Color = color;
    gl_Position = u_transformMatrix * vec4(position,1.0);

    vec3 transformedNormal = (u_transformMatrix*vec4(normal,1.0)).xyz;
    v_lightLevel = abs(dot(transformedNormal, normalize(lightPosition))); 
}
</script>
~~~

Fragment Shader : 
~~~ html

<script id="fshader" type="x-shader/x-fragment">
    
    precision mediump float;

    // our texture unit
    uniform sampler2D u_texture;

    varying vec2 v_textureCoordinates;
    varying vec3 v_Color;
    // light value sent to the fragment shader
    varying float v_lightLevel;

    void main(void) {
        
        // we multiply the color of the texture by the light level
        gl_FragColor = texture2D(u_texture,v_textureCoordinates)*v_lightLevel*2.0;


    }
</script>
~~~

Enable the new attributes in the setup() function
~~~ JavaScript
var normalAttributeLocation = GL.getAttribLocation(shaderProgramID, "normal");
GL.enableVertexAttribArray(normalAttributeLocation); // -> enable the new texture coord attribute here
~~~~

Create a new VBO containing the normals (always in the setup() function) : 

~~~ Javascript
// --------------- NORMALS ------------------------------
var vertexNormalArray=[
    0,0,1, //bottom left
    0,0,1, //bottom right
    0,0,1, //top right
    
    0,0,1, //top left
    0,0,1, // top right
    0,0,1, // bottom left
];

vertexNormalArray = getPyramidNormalesArray();

// create an empty buffer object
window.vertexBufferNormalID= GL.createBuffer ();

// bind to the new buffer object
GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferNormalID);

// send data to the new buffer object
GL.bufferData(GL.ARRAY_BUFFER,
            new Float32Array(vertexNormalArray),
            GL.STATIC_DRAW);
~~~		


In the draw color add the link between attribute and vbo : 
~~~ Javascript
GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferNormalID);
var normalAttibuteLocation = GL.getAttribLocation(shaderProgramID, "normal")
GL.vertexAttribPointer(normalAttibuteLocation, numberOfComponents, GL.FLOAT, false,0,0) ;
~~~