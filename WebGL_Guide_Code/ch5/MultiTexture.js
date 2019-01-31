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
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  varying vec2 v_TexCoord;
  void main() {
    vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
    vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
    gl_FragColor = color0 * color1;
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
  // 创建缓冲区对象
  var texture0 = gl.createTexture()
  var texture1 = gl.createTexture()
  if (!texture0 || !texture1) {
    console.log('Failed to create the texture object')
    return false
  }

  // 获取 纹理对象 存贮位置
  var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0')
  var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1')
  if (!u_Sampler0 || !u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler')
    return false
  }

  // 创建 Image 对象
  var image0 = new Image()
  var image1 = new Image()
  if (!image0 || !image1) {
    console.log('Failed to create the image object')
    return false
  }

  image0.onload = function () {
    loadTexture(gl, n, texture0, u_Sampler0, image0, 0)
  }
  image1.onload = function () {
    loadTexture(gl, n, texture1, u_Sampler1, image1, 1)
  }
  image0.src = '../resources/redflower.jpg'
  image1.src = '../resources/circle.gif'

  return true
}

// 标记纹理单元是否已经就绪
var g_texUnit0 = false,
    g_texUnit1 = false

function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
  // Flip the image's y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)

  // 激活纹理
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0)
    g_texUnit0 = true
  } else {
    gl.activeTexture(gl.TEXTURE1)
    g_texUnit1 = true
  }
  

  // 绑定纹理对象到目标
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

  // 设置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

  // 将纹理单元编号传递给取样器
  gl.uniform1i(u_Sampler, texUnit)

  gl.clear(gl.COLOR_BUFFER_BIT)

  if (g_texUnit0 && g_texUnit1) {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
  }
}

