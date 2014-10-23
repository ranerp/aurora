if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.DirectionalPassProgram = function(shaderProgram) {
    if(shaderProgram.TYPE !== AURORA.SHADER_PROGRAM_TYPE.DIRECTIONAL_PASS)
        throw "Wrong program type";

    this.program = shaderProgram.program;
    this.quadPositionLocation = 0;
    this.quadTexCoordLocation = 1;

    this.initialize();
};

AURORA.DirectionalPassProgram.prototype = {

    constructor: AURORA.DirectionalPassProgram,

    initialize: function() {
        this.activateProgram();

        AURORA.GL.bindAttribLocation(this.program, this.quadPositionLocation, "a_Position");
        AURORA.GL.bindAttribLocation(this.program, this.quadTexCoordLocation, "a_TexCoord");

        this.u_PositionTex = AURORA.GL.getUniformLocation(this.program, "u_PositionTex");
        this.u_NormalTex = AURORA.GL.getUniformLocation(this.program, "u_NormalTex");
        this.u_DepthTex = AURORA.GL.getUniformLocation(this.program, "u_DepthTex");
        this.u_ColorTex = AURORA.GL.getUniformLocation(this.program, "u_ColorTex");

        this.u_View = AURORA.GL.getUniformLocation(this.program, "u_View");

        this.u_DirectionalLight = {};
        this.u_DirectionalLight.direction = AURORA.GL.getUniformLocation(this.program, "u_DirectionalLight.direction");
        this.u_DirectionalLight.base = {};
        this.u_DirectionalLight.base.color = AURORA.GL.getUniformLocation(this.program, "u_DirectionalLight.base.color");
        this.u_DirectionalLight.base.ambientIntensity = AURORA.GL.getUniformLocation(this.program, "u_DirectionalLight.base.ambientIntensity");
        this.u_DirectionalLight.base.diffuseIntensity = AURORA.GL.getUniformLocation(this.program, "u_DirectionalLight.base.diffuseIntensity");
        this.u_DirectionalLight.base.specularPower = AURORA.GL.getUniformLocation(this.program, "u_DirectionalLight.base.specularPower");

        this.u_LightDirection = AURORA.GL.getUniformLocation(this.program, "u_LightDirection");
    },

    activateProgram: function() {
        AURORA.GL.useProgram(this.program);
    },

    setUniforms: function(u_View, u_DirectionalLight) {
        AURORA.GL.uniformMatrix4fv(this.u_View, false, u_View);

        AURORA.GL.uniform3fv(this.u_LightDirection, u_DirectionalLight.direction);

        AURORA.GL.uniform3fv(this.u_DirectionalLight.direction, u_DirectionalLight.direction);
        AURORA.GL.uniform3fv(this.u_DirectionalLight.base.color, u_DirectionalLight.baseLight.color);
        AURORA.GL.uniform1f(this.u_DirectionalLight.base.ambientIntensity, u_DirectionalLight.baseLight.ambientIntensity);
        AURORA.GL.uniform1f(this.u_DirectionalLight.base.diffuseIntensity, u_DirectionalLight.baseLight.diffuseIntensity);
        AURORA.GL.uniform1f(this.u_DirectionalLight.base.specularPower, u_DirectionalLight.baseLight.specularPower);

    },

    setUpTextures: function(depthTexture, normalTexture, positionTexture, colorTexture) {
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

    draw: function(vboVertices, vboTextures, vboIndices, numIndices) {
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