// LookAtTriangles.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_MvpMatrix;
  varying vec4 v_Color;
  void main () {
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
  }
`

// Fragment shader program
var FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`

function main () {
  // Retrieve <canvas> element
  const canvas = document.getElementById('webgl')

  // Get the rendering context for WebGL
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL')
    return
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.')
    return
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl)
  if (n < 0) {
    console.log('Failed to set the positions of the vertices')
    return
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0)


  // 获取 u_ViewMatrix u_ModelMatrix 变量的存储地址
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage locations of u_ViewMatrix');
    return;
  }

  /*
  // 设置视点、视线和上方向
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 2, 0);

  // 计算旋转矩阵
  var modelMatrix = new Matrix4()
  modelMatrix.setRotate(-10, 0, 0, 1)

  // 两个矩阵相乘
  var modelViewMatrix = viewMatrix.multiply(modelMatrix)
  */

  // 使用一行代码
  var modelMatrix = new Matrix4()
  var viewMatrix = new Matrix4()
  var projMatrix = new Matrix4()
  var mvpMatrix = new Matrix4()

  modelMatrix.setTranslate(-0.75, 0, 0)
  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0)
  projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100)
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)

  document.onkeydown = function (ev) {
    keydown(ev, gl, n, u_MvpMatrix, mvpMatrix)
  }

  draw(gl, n, u_MvpMatrix, mvpMatrix)

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);

  // // Draw the rectangle
  // gl.drawArrays(gl.TRIANGLES, 0, n);

}

var g_eyeX = 0, g_eyeY = 0, g_eyeZ = 5 // 视点

function keydown (ev, gl, n, u_ModelViewMatrix, modelViewMatrix) {
  if (ev.keyCode === 39) {
    g_eyeX += 0.01
  } else if (ev.keyCode === 37) {
    g_eyeX -= 0.01;
  } else {
    return
  }

  draw(gl, n, u_ModelViewMatrix, modelViewMatrix)
}

function draw (gl, n, u_MvpMatrix, mvpMatrix) {
  // 将矩阵传给 uniform 变量
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // Three triangles on the right side
    0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
    0.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
    1.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 

    0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
    0.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
    1.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 

    0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
    0.25, -1.0,   0.0,  0.4,  0.4,  1.0,
    1.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
  ]);

  var n = 9;

  // Create a buffer object
  var vertexColorbuffer = gl.createBuffer()
  if (!vertexColorbuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write the vertex coordinates and color to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

  var FSIZE = verticesColors.BYTES_PER_ELEMENT

  // Assign the buffer object to a_Position and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  // 使顶点着色器能够访问缓冲区数据
  gl.enableVertexAttribArray(a_Position);

  // Assign the buffer object to a_Color and enable the assignment
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

