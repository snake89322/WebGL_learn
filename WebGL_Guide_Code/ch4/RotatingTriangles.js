// MultiPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  uniform mat4 u_ModelMatrix;
  attribute vec4 a_Position;
  void main () {
    gl_Position = u_ModelMatrix * a_Position;
    gl_PointSize = 10.0;
  }
`

// Fragment shader program
var FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
  }
`

var ANGLE_STEP = 185.0

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

  // 将旋转矩阵传输给顶点着色器
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  
  // Rotating
  var currentAngle = 0.0
  var modelMatrix = new Matrix4()

  var tick = function () {
    currentAngle = animate(currentAngle)
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix)
    requestAnimationFrame(tick)
  }

  tick()

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1)
}

var g_last = Date.now()
function animate (angle) {
  var now = Date.now()
  var elapsed = now - g_last // ms
  g_last = now
  
  // 根据是上次调用时间，更新当前旋转角度
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0

  return newAngle %= 360
}

function draw (gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  // 设置旋转矩阵
  modelMatrix.setRotate(currentAngle, 0, 0, 1)

  // 输入给顶点着色器
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Draw three points
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0.0, 0.3,   -0.3, -0.3,  0.3, -0.3
  ])
  var n = 3; // The number of vertices

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
