// MultiPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;
  void main () {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
  }
`

// Fragment shader program
var FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
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



  // Set texture
  if (!initTextures(gl, n)) {
    console.log('Failed to intialize the texture.');
    return;
  }
}


function initVertexBuffers(gl) {
  var verticesTexCoords = new Float32Array([
    -0.5, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0,
    0.5, 0.5, 1.0, 1.0,
    0.5, -0.5, 1.0, 0.0
  ])
  var n = 4; // The number of vertices

  // Create a buffer object
  var verticesTexCoordsBuffer = gl.createBuffer()
  if (!verticesTexCoordsBuffer) {
    console.log('Failed to create the buffer object')
    return -1
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesTexCoordsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW)

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return -1
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)
  gl.enableVertexAttribArray(a_Position)

  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord')
  if (a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_TexCoord')
    return -1
  }

  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
  gl.enableVertexAttribArray(a_TexCoord)

  // var a_Color = gl.getAttribLocation(gl.program, 'a_Color')
  // if (a_Color < 0) {
  //   console.log('Failed to get the storage location of a_Color')
  //   return -1
  // }
  // gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  // gl.enableVertexAttribArray(a_Color)

  // Unbind the buffer object
  // gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n
}

function initTextures (gl, n) {
  var texture = gl.createTexture()
  if (!texture) {
    console.log('Failed to create the texture object')
    return false
  }

  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler')
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler')
    return false
  }

  var image = new Image()
  if (!image) {
    console.log('Failed to create the image object')
    return false
  }

  image.onload = function () {
    loadTexture(gl, n, texture, u_Sampler, image)
  }
  image.src = '../resources/sky.jpg'

  return true
}

function loadTexture(gl, n, texture, u_Sampler, image) {
  // Flip the image's y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)

  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0)

  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
}

