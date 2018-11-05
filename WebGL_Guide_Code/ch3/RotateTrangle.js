// MultiPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  uniform vec4 u_Translation;
  uniform float u_CosB, u_SinB;
  attribute vec4 a_Position;
  void main () {
    gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB + u_Translation.x;
    gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB + u_Translation.y;
    gl_Position.z = a_Position.z + u_Translation.z;
    gl_Position.w = a_Position.w + u_Translation.w;
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

var ANGLE = 45.0

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

  var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB')
  var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB')

  gl.uniform1f(u_CosB, cosB)
  gl.uniform1f(u_SinB, sinB)

  gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0)

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
