---
layout: default
title:  "Textures"
num: 4

---


## a) How texture works

Ok it's time to drop our solid color quad and replace it by something potentially more exiting : textures. 

A texture is are memory buffer on the GPU allocated to store an image.  


<img src="./assets/webGLTextureDiagram.jpg" alt="Textures on the GPU">


~~~ html
<script id="vshader" type="x-shader/x-vertex">

    attribute vec3 position;
    attribute vec3 color;

    // we declare a new input attribute : the texture coordinates
    attribute vec2 texureCoordinates;

    uniform mat4 u_transformMatrix;

    // texture coordinates sent to the fragment shader
    varying vec2 v_textureCoordinates;
    varying vec3 v_Color;

    void main(void) 
    { 
        // forward the coordinates to the fragment shader
        v_textureCoordinates = texureCoordinates;
        v_Color = color;
        gl_Position = u_transformMatrix * vec4(position,1.0);
    }
</script>

~~~

~~~ html
<script id="textureFshader" type="x-shader/x-fragment">
    
    precision mediump float;

    // our texture unit
    uniform sampler2D u_texture;

    // the texture coordinates received from the vertex shader
    varying vec2 v_textureCoordinates;
    varying vec3 v_Color;

    void main(void) {
        // sample the texture unit u_texture at coordinate v_textureCoordinates
        gl_FragColor = texture2D(u_texture,v_textureCoordinates);
    }
</script>

~~~

(enable the attribute we added in the vertex shader)

~~~ JavaScript

// enable the attributes
GL.enableVertexAttribArray(colorAttributeLocation);
GL.enableVertexAttribArray(positionAttributeLocation);
GL.enableVertexAttribArray(texCoordAttributeLocation); // -> enable the new texture coord attribute here

~~~

(load the texture in the GPU memory)

~~~ JavaScript
function loadTexture(imageURL)
{
    // create an empty texture object on the GPU
    var textureID = GL.createTexture();

    // Asynchronously load an image
    var image = new Image();

    image.crossOrigin = "";
    image.src = imageURL;
    
    image.addEventListener('load', function() 
    {
        // bind to the new texture object
        GL.bindTexture(GL.TEXTURE_2D, textureID);

        // configure the texture object
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);

        // send image to the texture object
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);

        window.texureIsLoaded = true;
    });

    return textureID;
}
~~~

(create a new VBO with texture coordinates)

~~~ JavaScript
// load the texture on the GPU
window.textureID = loadTexture("texture.jpg");

// define the texture coordinates
var textureCoordinateArray=[
    0,0, //bottom left
    1,0, //bottom right 
    1,1,  //top right

    0,1, //top left
    1,1, // top right
    0,0, // bottom left
];

// create an empty buffer object
window.vertexBufferTexCoordID = GL.createBuffer ();

// bind to the new buffer object 
GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferTexCoordID);

// send data to the new buffer object
GL.bufferData(GL.ARRAY_BUFFER,
            new Float32Array(textureCoordinateArray),
            GL.STATIC_DRAW);
~~~

(in the draw loop : glue between the vbo texture coord, and the attribute texture coord in the shader)

~~~ JavaScript
numberOfComponents = 2;
// link our vertex buffer to the shader attribute texture coordinate
GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferTexCoordID); // -> next draw will use that buffer
var positionAttibuteLocation = GL.getAttribLocation(shaderProgramID, "texureCoordinates");
GL.vertexAttribPointer(positionAttibuteLocation, numberOfComponents, GL.FLOAT, false,0,0) ;
~~~

(in the draw loop : tell the GPU to link our texture to TEXTURE_0)

~~~ JavaScript
// assign our texture object to texture unit TEXTURE_0 
GL.activeTexture(GL.TEXTURE0);
GL.bindTexture(GL.TEXTURE_2D, textureID);
~~~



## d) Using a second textures as tool
* generate a second texture
* set a second texture uniform and set the right texture unit (not needed previously because by default texuteUnit = 0)
* use the second texture as displacement map (?)

ref: https://open.gl/textures
