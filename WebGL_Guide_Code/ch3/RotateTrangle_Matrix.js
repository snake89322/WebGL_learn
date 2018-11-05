// MultiPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  uniform mat4 u_xformMatrix;
  uniform mat4 u_xformMatrix_skew;
  attribute vec4 a_Position;
  void main () {
    gl_Position = u_xformMatrix * a_Position * u_xformMatrix_skew;
    gl_PointSize = 10.0;
  }
`

// Fragment shader program
var FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
  }
`

var Tx = 0.5,
    Ty = 0.5,
    Tz = 0

var Sx = 0.5,
    Sy = 0.5,
    Sz = 0.5

var ANGLE = 25.0

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

  var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation')

  var radian = Math.PI * ANGLE / 180.0
  var cosB = Math.cos(radian)
  var sinB = Math.sin(radian)

  // WebGL 中矩阵是列主序的
  var xformMatrix = new Float32Array([
    cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    Tx, Ty, Tz, 1.0
  ])

  var xformMatrix_skew = new Float32Array([
    Sx, 0.0, 0.0, 0.0,
    0.0, Sy, 0.0, 0.0,
    0.0, 0.0, Sz, 0.0,
    0.0, 0.0, 0.0, 1.0
  ])

  // 将旋转矩阵传输给顶点着色器
  var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  var u_xformMatrix_skew = gl.getUniformLocation(gl.program, 'u_xformMatrix_skew');
  
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix)
  gl.uniformMatrix4fv(u_xformMatrix_skew, false, xformMatrix_skew)

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Draw three points
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    -0.5, 0.5,   -0.5, -0.5,  0.5, -0.5 ,0.5, 0.5
  ])
  var n = 4; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object')
    return -1
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return -1
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position)

  return n
}
