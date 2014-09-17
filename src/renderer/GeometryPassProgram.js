if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.GeometryPassProgram = function(shaderProgram) {
    if(shaderProgram.TYPE !== AURORA.SHADER_PROGRAM_TYPE.GEOMETRY_PASS)
        throw "Wrong program type";

    this.program = shaderProgram.program;

    this.initialize();
};

AURORA.GeometryPassProgram.prototype = {

    constructor: AURORA.GeometryPassProgram,

    initialize: function() {
        this.activateProgram();

        this.a_Position = AURORA.GL.getAttribLocation(this.program, "a_Position");
        this.a_Normal = AURORA.GL.getAttribLocation(this.program, "a_Normal");
        this.a_TexCoord = AURORA.GL.getAttribLocation(this.program, "a_TexCoord");

        this.u_Model = AURORA.GL.getUniformLocation(this.program, "u_Model");
        this.u_View = AURORA.GL.getUniformLocation(this.program, "u_View");
        this.u_Perspective = AURORA.GL.getUniformLocation(this.program, "u_Perspective");
        this.u_InvTranspose = AURORA.GL.getUniformLocation(this.program, "u_InvTranspose");

        this.u_Texture = AURORA.GL.getUniformLocation(this.program, "u_Texture");
    },

    activateProgram: function() {
        AURORA.GL.useProgram(this.program);
    },

    setUniforms: function(u_Model, u_View, u_Perspective, u_InvTranspose) {
        AURORA.GL.uniformMatrix4fv(this.u_Model, false, u_Model);
        AURORA.GL.uniformMatrix4fv(this.u_View, false, u_View);
        AURORA.GL.uniformMatrix4fv(this.u_Perspective, false, u_Perspective);
        AURORA.GL.uniformMatrix4fv(this.u_InvTranspose, false, u_InvTranspose);
    },

    drawElements: function(vertexBuffer, indexBuffer, texture) {
        AURORA.GL.bindBuffer(AURORA.GL.ARRAY_BUFFER, vertexBuffer.buffer);

        this.enableVertexAttributeData();
        this.setVertexAttributeData(vertexBuffer);

        this.setActiveTexture(texture);

        AURORA.GL.bindBuffer(AURORA.GL.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        AURORA.GL.drawElements(AURORA.GL.TRIANGLES, indexBuffer.numItems, AURORA.GL.UNSIGNED_SHORT, 0);

        this.disableVertexAttributeData();
    },

    enableVertexAttributeData: function() {
        AURORA.GL.enableVertexAttribArray(this.a_Position);
        AURORA.GL.enableVertexAttribArray(this.a_Normal);
        AURORA.GL.enableVertexAttribArray(this.a_TexCoord);
    },

    setVertexAttributeData: function(buffer) {
        AURORA.GL.vertexAttribPointer(this.a_Position, 3, AURORA.GL.FLOAT, false, buffer.itemSize * 4, 0);
        AURORA.GL.vertexAttribPointer(this.a_Normal, 3, AURORA.GL.FLOAT, false, buffer.itemSize * 4, 3 * 4);
        AURORA.GL.vertexAttribPointer(this.a_TexCoord, 2, AURORA.GL.FLOAT, false, buffer.itemSize * 4, buffer.itemSize * 4 - 2 * 4);
    },

    setActiveTexture: function(texture) {
        AURORA.GL.activeTexture(AURORA.GL.TEXTURE0);
        AURORA.GL.bindTexture(AURORA.GL.TEXTURE_2D, texture.texture);
        AURORA.GL.uniform1i(this.u_Texture, 0);
    },

    disableVertexAttributeData: function() {
        AURORA.GL.disableVertexAttribArray(this.a_Position);
        AURORA.GL.disableVertexAttribArray(this.a_Normal);
        AURORA.GL.disableVertexAttribArray(this.a_TexCoord);
    },
};