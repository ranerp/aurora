if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.SHADER_PROGRAM_TYPE = {
    LAMBERT: "lambert",
    GEOMETRY_PASS: "geometry.pass",
    TEST_PASS: "test.pass"
};

AURORA.ShaderProgram = function(program, PROGRAM_TYPE) {
    this.program = program;

    this.TYPE = PROGRAM_TYPE;

    this.quadPositionLocation = 0;
    this.quadTexCoordLocation = 1;

    this.initialize();
};

AURORA.ShaderProgram.prototype = {

    constructor: AURORA.ShaderProgram,

    initialize: function() {
        this.activate();

        if(this.TYPE === AURORA.SHADER_PROGRAM_TYPE.GEOMETRY_PASS)
            this.initializeGeometryPass();
        else if(this.TYPE === AURORA.SHADER_PROGRAM_TYPE.TEST_PASS)
            this.initializeTestPass();
    },

    initializeGeometryPass: function() {
        this.a_Position = AURORA.GL.getAttribLocation(this.program, "a_Position");
        this.a_Normal = AURORA.GL.getAttribLocation(this.program, "a_Normal");
        this.a_TexCoord = AURORA.GL.getAttribLocation(this.program, "a_TexCoord");

        this.u_Model = AURORA.GL.getUniformLocation(this.program, "u_Model");
        this.u_View = AURORA.GL.getUniformLocation(this.program, "u_View");
        this.u_Perspective = AURORA.GL.getUniformLocation(this.program, "u_Perspective");
        this.u_InvTranspose = AURORA.GL.getUniformLocation(this.program, "u_InvTranspose");

        this.u_Texture = AURORA.GL.getUniformLocation(this.program, "u_Texture");
    },

    activate: function() {
        AURORA.GL.useProgram(this.program);
    },

    setGeometryPassUniforms: function(u_Model, u_View, u_Perspective, u_InvTranspose) {
        AURORA.GL.uniformMatrix4fv(this.u_Model, false, u_Model);
        AURORA.GL.uniformMatrix4fv(this.u_View, false, u_View);
        AURORA.GL.uniformMatrix4fv(this.u_Perspective, false, u_Perspective);
        AURORA.GL.uniformMatrix4fv(this.u_InvTranspose, false, u_InvTranspose);
    },

    bindVertexBuffer: function(buffer) {
        AURORA.GL.bindBuffer(AURORA.GL.ARRAY_BUFFER, buffer.buffer);
        this.enableVertexAttributeData();
    },

    setVertexAttributeData: function(buffer) {
        AURORA.GL.vertexAttribPointer(this.a_Position, 3, AURORA.GL.FLOAT, false, buffer.itemSize * 4, 0);
        AURORA.GL.vertexAttribPointer(this.a_TexCoord, 2, AURORA.GL.FLOAT, false, buffer.itemSize * 4, buffer.itemSize * 4 - 2 * 4);
        AURORA.GL.vertexAttribPointer(this.a_Normal, 3, AURORA.GL.FLOAT, false, buffer.itemSize * 4, 3 * 4);
    },

    enableVertexAttributeData: function() {
        AURORA.GL.enableVertexAttribArray(this.a_Position);
        AURORA.GL.enableVertexAttribArray(this.a_Normal);
        AURORA.GL.enableVertexAttribArray(this.a_TexCoord);
    },

    disableVertexAttributeData: function() {
        AURORA.GL.disableVertexAttribArray(this.a_Position);
        AURORA.GL.disableVertexAttribArray(this.a_Normal);
        AURORA.GL.disableVertexAttribArray(this.a_TexCoord);
    },

    setActiveTexture: function(texture) {
        AURORA.GL.activeTexture(AURORA.GL.TEXTURE0);
        AURORA.GL.bindTexture(AURORA.GL.TEXTURE_2D, texture.texture);
        AURORA.GL.uniform1i(this.u_Texture, 0);
    },

    bindIndexBuffer: function(buffer) {
        AURORA.GL.bindBuffer(AURORA.GL.ELEMENT_ARRAY_BUFFER, buffer.buffer);
    },

    drawElements: function(buffer) {
        AURORA.GL.drawElements(AURORA.GL.TRIANGLES, buffer.numItems, AURORA.GL.UNSIGNED_SHORT, 0);
        this.disableVertexAttributeData();
    },

    initializeTestPass: function() {
        AURORA.GL.bindAttribLocation(this.program, this.quadPositionLocation, "a_Position");
        AURORA.GL.bindAttribLocation(this.program, this.quadTexCoordLocation, "a_TexCoord");

        this.u_PositionTex = AURORA.GL.getUniformLocation(this.program, "u_PositionTex");
        this.u_NormalTex = AURORA.GL.getUniformLocation(this.program, "u_NormalTex");
        this.u_DepthTex = AURORA.GL.getUniformLocation(this.program, "u_DepthTex");
        this.u_ColorTex = AURORA.GL.getUniformLocation(this.program, "u_ColorTex");
    },

    setUpTestPass: function(depthTexture, normalTexture, positionTexture, colorTexture) {
        this.activate();

        AURORA.GL.activeTexture(AURORA.GL.TEXTURE0);
        AURORA.GL.bindTexture(AURORA.GL.TEXTURE_2D, depthTexture);
        AURORA.GL.uniform1i(this.u_DepthTex, 0);

        AURORA.GL.activeTexture(AURORA.GL.TEXTURE1);
        AURORA.GL.bindTexture(AURORA.GL.TEXTURE_2D, normalTexture);
        AURORA.GL.uniform1i(this.u_NormalTex, 1);

        AURORA.GL.activeTexture(AURORA.GL.TEXTURE2);
        AURORA.GL.bindTexture(AURORA.GL.TEXTURE_2D, positionTexture);
        AURORA.GL.uniform1i(this.u_PositionTex,2);

        AURORA.GL.activeTexture(AURORA.GL.TEXTURE3);
        AURORA.GL.bindTexture(AURORA.GL.TEXTURE_2D, colorTexture);
        AURORA.GL.uniform1i(this.u_ColorTex, 3);
    },

    drawTestPass: function(vboVertices, vboTextures, vboIndices, numIndices) {
        AURORA.GL.enableVertexAttribArray(this.quadPositionLocation);
        AURORA.GL.enableVertexAttribArray(this.quadTexCoordLocation);

        AURORA.GL.bindBuffer(AURORA.GL.ARRAY_BUFFER, vboVertices);
        AURORA.GL.vertexAttribPointer(this.quadPositionLocation, 3, AURORA.GL.FLOAT, false, 0, 0);

        AURORA.GL.bindBuffer(AURORA.GL.ARRAY_BUFFER, vboTextures);
        AURORA.GL.vertexAttribPointer(this.quadTexCoordLocation, 2, AURORA.GL.FLOAT, false, 0, 0);

        AURORA.GL.bindBuffer(AURORA.GL.ELEMENT_ARRAY_BUFFER, vboIndices);

        AURORA.GL.drawElements(AURORA.GL.TRIANGLES, numIndices, AURORA.GL.UNSIGNED_SHORT, 0);

        AURORA.GL.disableVertexAttribArray(this.quadPositionLocation);
        AURORA.GL.disableVertexAttribArray(this.quadTexCoordLocation);
    }


};