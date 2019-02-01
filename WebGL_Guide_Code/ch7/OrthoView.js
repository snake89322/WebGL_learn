// LookAtTriangles.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ProjMatrix;
  varying vec4 v_Color;
  void main () {
    gl_Position = u_ProjMatrix * a_Position;
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
  // 获取 nearFar 元素
  const nf = document.getElementById('nearFar')

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


  // 获取 u_ViewMatrix 变量的存储地址
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if (!u_ProjMatrix) { 
    console.log('Failed to get the storage locations of u_ProjMatrix');
    return;
  }

  // 设置视点、视线和上方向
  var projMatrix = new Matrix4();
  
  // 注册键盘事件
  document.onkeydown = function (ev) {
    keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf)
  }

  draw(gl, n, u_ProjMatrix, projMatrix, nf)
  
  

}

// 视点与近、远剪裁面的距离
var g_near = 0.0, g_far = 0.5

function keydown (ev, gl, n, u_ProjMatrix, projMatrix, nf) {
  switch (ev.keyCode) {
    case 39: g_near += 0.01; break; // 右
    case 37: g_near -= 0.01; break; // 左
    case 38: g_far += 0.01; break; // 上
    case 40: g_far -= 0.01; break; // 下
    default: return;
  }

  draw(gl, n, u_ProjMatrix, projMatrix, nf)
}

function draw (gl, n, u_ProjMatrix, projMatrix, nf) {
  // 使用矩阵设置可视空间
  projMatrix.setOrtho(-1, 1, -1, 1, g_near, g_far)
  
  // 将视图矩阵传给 u_ViewMatrix 变量
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 显示当前的 near 和 far 值
  nf.innerHTML = `near:${Math.round(g_near * 100)/100}, far:${Math.round(g_far * 100)/100}`

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // Vertex coodinates and color(RGBA)
    0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
   -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
    0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 

    0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
   -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
    0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

    0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
   -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
    0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
  ])

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

