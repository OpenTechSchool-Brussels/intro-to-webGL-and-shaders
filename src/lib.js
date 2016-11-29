 
  // 1) Initialisation
  var func_1_initialisation = function(canvasId) {

    // Canvas
    window.CANVAS=document.getElementById(canvasId);
    CANVAS.width=window.innerWidth;
    CANVAS.height=window.innerHeight;

    // WebGl Context
    try {
      window.GL = CANVAS.getContext("webgl");
    } catch (e) {
      alert("You are not webgl compatible :(") ;
      return false;
    }
    
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
  }
  
    
  // 2) Shaders  
  var func_2_createShaders = function() {
    var shader_vertex_source="\n\
    attribute vec3 position; //the position of the point\n\
    attribute vec3 color;  //the color of the point\n\
    \n\
    varying vec3 vColor;\n\
    void main(void) { //pre-built function\n\
    gl_Position = vec4(position, 1.); //0. is the z, and 1 is w\n\
    vColor=color;\n\
    }";


    var shader_fragment_source="\n\
    precision mediump float;\n\
    \n\
    \n\
    \n\
    varying vec3 vColor;\n\
    void main(void) {\n\
    gl_FragColor = vec4(1.0);\n\
    }";


    var compileShader=function(source, type, typeString) 
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

    var shaderVertexID=compileShader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    var shaderFragmentID=compileShader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

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
    //GL.enableVertexAttribArray(colorAttributeLocation);
    GL.enableVertexAttribArray(positionAttributeLocation);
  }
  
  // 2bis) Shaders but from HTML
  
  var func_2bis_createShadersFromHTML = function() {

    var compileShader=function(source, type, typeString) 
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

    var vshaderString = document.getElementById("vshader").text
    var shaderVertexID=compileShader(vshaderString, GL.VERTEX_SHADER, "VERTEX");
 
    var fshaderString = document.getElementById("fshader").text
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
    //GL.enableVertexAttribArray(colorAttributeLocation);
    GL.enableVertexAttribArray(positionAttributeLocation);
  }
  

  
  
  // 3) Triangle
  var func_3_createTriangle = function() {

    // define vertices of our first quad
    var vertexPositionArray=[
        //----- face 1
        -0.5,-0.5,0, //bottom left 
        0.5,-0.5,0, //bottom right 
        0.5,0.5,0,  //top right
        
        -0.5,0.5,0, //top left
        0.5,0.5,0, // top right
        -0.5,-0.5,0, // bottom left

    ];

    var vertexColorArray=[
        1,1,1, //bottom left
        1,1,1, //bottom right
        1,1,1, //top right
        
        0,0,1, //top left
        1,0,0, // top right
        0,1,0, // bottom left
    ];

    // this variable will be used later, during the draw call
    window.numberOfVertices = 3;
    
    // create an empty buffer object
    window.vertexBufferPositionID= GL.createBuffer ();

    // bind to the new buffer object 
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferPositionID);

    // send data to the new buffer object
    GL.bufferData(GL.ARRAY_BUFFER,
                new Float32Array(vertexPositionArray),
                GL.STATIC_DRAW);

    window.vertexBufferColorID= GL.createBuffer ();
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferColorID);
    GL.bufferData(GL.ARRAY_BUFFER,
                new Float32Array(vertexColorArray),
                GL.STATIC_DRAW);
  };

  /*========================= DRAWING ========================= */
  var func_4_draw=function() {

    // use the shader we defined earlier
    GL.useProgram(shaderProgramID);

    // define the size of the view
    GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);

    // clear the color buffer
    GL.clear(GL.COLOR_BUFFER_BIT);

    var numberOfComponents = 3

    // link our vertex buffer to the shader attribute position
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferPositionID); // -> next draw will use that buffer
    var positionAttibuteLocation = GL.getAttribLocation(shaderProgramID, "position");
    GL.vertexAttribPointer(positionAttibuteLocation, numberOfComponents, GL.FLOAT, false,0,0) ;
    

    /*
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBufferColorID);
    var colorAttibuteLocation = GL.getAttribLocation(shaderProgramID, "color")
    GL.vertexAttribPointer(colorAttibuteLocation, numberOfComponents, GL.FLOAT, false,0,0) ;
    */
    GL.drawArrays(GL.TRIANGLES, 0, window.numberOfVertices);


    window.requestAnimationFrame(func_4_draw);
  };

  var func_doAll = function() {
    // You set up everything
    func_1_initialisation();
    func_2_createShader();  
    func_3_createTriangle();

    // You play with and animate it
    func_4_animate();
  }
