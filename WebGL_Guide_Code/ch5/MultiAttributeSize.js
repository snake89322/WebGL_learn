// MultiPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  void main () {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
  }
`

// Fragment shader program
var FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
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

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n)
}


function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0.0, 0.3,   -0.3, -0.3,  0.3, -0.3
  ])
  var sizes = new Float32Array([
    10.0, 20.0, 30.0
  ])
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer()
  var sizeBuffer = gl.createBuffer()
  if (!vertexBuffer || !sizeBuffer) {
    console.log('Failed to create the buffer object')
    return -1
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return -1
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)


  // 将顶点尺寸写入缓冲区对象并开启
  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
  if (a_PointSize < 0) {
    console.log('Failed to get the storage location of a_PointSize')
    return -1
  }
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_PointSize)

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n
}
