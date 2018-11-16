// MultiPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  void main () {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
    v_Color = a_Color;
  }
`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform float u_Width;
  uniform float u_Height;
  void main() {
    gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);
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
  gl.drawArrays(gl.TRIANGLES, 0, n)
}


function initVertexBuffers(gl) {
  var verticesSizes = new Float32Array([
    0.0, 0.3, 10.0, 1.0, 0.0, 0.0,
    -0.3, -0.3, 20.0, 0.0, 1.0, 0.0,
    0.3, -0.3, 30.0, 0.0, 0.0, 1.0,
  ])
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexSizeBuffer = gl.createBuffer()
  if (!vertexSizeBuffer) {
    console.log('Failed to create the buffer object')
    return -1
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW)

  var FSIZE = verticesSizes.BYTES_PER_ELEMENT

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return -1
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_Position)

  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
  if (a_PointSize < 0) {
    console.log('Failed to get the storage location of a_PointSize')
    return -1
  }
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2)
  gl.enableVertexAttribArray(a_PointSize)

  var u_Width = gl.getUniformLocation(gl.program, 'u_Width')
  if (!u_Width) {
    console.log('Failed to get the storage location of u_Width')
    return;
  }

  var u_Height = gl.getUniformLocation(gl.program, 'u_Height')
  if (!u_Height) {
    console.log('Failed to get the storage location of u_Height')
    return;
  }
  // Pass the width and hight of the <canvas>
  gl.uniform1f(u_Width, gl.drawingBufferWidth);
  gl.uniform1f(u_Height, gl.drawingBufferHeight);

  // var a_Color = gl.getAttribLocation(gl.program, 'a_Color')
  // if (a_Color < 0) {
  //   console.log('Failed to get the storage location of a_Color')
  //   return -1
  // }
  // gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  // gl.enableVertexAttribArray(a_Color)

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n
}
