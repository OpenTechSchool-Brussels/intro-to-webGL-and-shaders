 
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
    attribute vec2 position; //the position of the point\n\
    attribute vec3 color;  //the color of the point\n\
    \n\
    varying vec3 vColor;\n\
    void main(void) { //pre-built function\n\
    gl_Position = vec4(position, 0., 1.); //0. is the z, and 1 is w\n\
    vColor=color;\n\
    }";


    var shader_fragment_source="\n\
    precision mediump float;\n\
    \n\
    \n\
    \n\
    varying vec3 vColor;\n\
    void main(void) {\n\
    gl_FragColor = vec4(vColor, 1.);\n\
    }";


    var compileShader=function(source, type, typeString) 
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

    var shaderVertexID=compileShader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    var shaderFragmentID=compileShader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    window.shaderProgramID=GL.createProgram();
    GL.attachShader(shaderProgramID, shaderVertexID);
    GL.attachShader(shaderProgramID, shaderFragmentID);
    GL.linkProgram(shaderProgramID);

    GL.enableVertexAttribArray(GL.getAttribLocation(shaderProgramID, "color"));
    GL.enableVertexAttribArray(GL.getAttribLocation(shaderProgramID, "position"));
  }
  
  
  // 3) Triangle
  var func_3_createTriangle = function() {

    var triangle_vertex_position=[
        //----- face 1
        -0.5,-0.5,0, //first summit -> bottom left of the viewport
        0.5,-0.5,0, //bottom right of the viewport
        0.5,0.5,0,  //top right of the viewport
        
        -0.5,0.5,0,
        0.5,0.5,0,
        -0.5,-0.5,0,

        //----- face 2

    ];

    var triangle_vertex_color=[

        1,1,1, 
        1,1,1, 
        1,1,1, 
        
        0,0,1, 
        1,0,0, 
        0,1,0, 


    ];

    window.TRIANGLE_VERTEX_POSITION= GL.createBuffer ();
    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX_POSITION);
    GL.bufferData(GL.ARRAY_BUFFER,
                new Float32Array(triangle_vertex_position),
                GL.STATIC_DRAW);

    window.TRIANGLE_VERTEX_COLOR= GL.createBuffer ();
    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX_COLOR);
    GL.bufferData(GL.ARRAY_BUFFER,
                new Float32Array(triangle_vertex_color),
                GL.STATIC_DRAW);
  };

  /*========================= DRAWING ========================= */
  var func_4_draw=function() {

    GL.useProgram(shaderProgramID);

    GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT);

    var numberOfComponents = 3

    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX_POSITION);
    var positionAttibuteLocation = GL.getAttribLocation(shaderProgramID, "position");
    GL.vertexAttribPointer(positionAttibuteLocation, numberOfComponents, GL.FLOAT, false,0,0) ;
    

    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX_COLOR);
    var colorAttibuteLocation = GL.getAttribLocation(shaderProgramID, "color")
    GL.vertexAttribPointer(colorAttibuteLocation, numberOfComponents, GL.FLOAT, false,0,0) ;

    GL.drawArrays(GL.TRIANGLES, 0, 3);


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
