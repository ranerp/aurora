if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.Mesh = function(vertexBuffer, meshId, rotation, translation, scale) {
    this.meshId = meshId;

    if(typeof(rotation) === "undefined")
        this.rotation = [0.0, 0.0, 0.0, 0.0];
    else
        this.rotation = rotation;

    if(typeof(translation) === "undefined")
        this.translation = [0.0, 0.0, 0.0];
    else
        this.translation = translation;

    if(typeof(scale) === "undefined")
        this.scale = [1.0, 1.0, 1.0];
    else
        this.scale = scale;

    this.vertexBuffer = vertexBuffer;

    this.parts = [];

    this.children = [];

    this.DIRTY_FLAG = true;
    this.modelMatrix = mat4.create();
};

AURORA.Mesh.prototype = {

    constructor: AURORA.Mesh,

    addChild: function(mesh) {
        this.children.push(mesh);
    },

    addMeshPart: function(meshPart) {
        this.parts.push(meshPart);
    },

    setVertexBuffer: function(vertexBuffer) {
        this.vertexBuffer = vertexBuffer;
    },

    setDirtyFlag: function(bool) {
        this.DIRTY_FLAG = bool;

        for(var i = 0; i < this.children.length; i++)
            this.children[i].setDirtyFlag(bool);
    },

    render: function(program, modelMatrixStack, viewMatrix, perspectiveMatrix) {
        modelMatrixStack.push();

        if(this.DIRTY_FLAG)
            this.calculateModelMatrix(modelMatrixStack);
        else
            modelMatrixStack.multiply(this.modelMatrix);

        this.renderParts(program, modelMatrixStack.getMatrix(), viewMatrix, perspectiveMatrix);

        for(var i = 0; i < this.children.length; i++) {
            this.children[i].render(program, modelMatrixStack, viewMatrix, perspectiveMatrix);
        }

        modelMatrixStack.pop();
    },

    renderParts: function(program, modelMatrix, viewMatrix, perspectiveMatrix) {
        for(var i = 0; i < this.parts.length; i++) {
            program.activateProgram();
            program.setUniforms(modelMatrix, viewMatrix, perspectiveMatrix, AURORA.Math.getITNormal(viewMatrix, modelMatrix));
            program.drawElements(this.vertexBuffer, this.parts[i].indexBuffer, this.parts[i].material.texture);
        }
    },

    calculateModelMatrix: function(modelMatrixStack) {
        modelMatrixStack.rotateTranslate(this.rotation, this.translation);
        modelMatrixStack.scale(this.scale);

        this.modelMatrix = modelMatrixStack.clone();

        this.DIRTY_FLAG = false;
    }
};