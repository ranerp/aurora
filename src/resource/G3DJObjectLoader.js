if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.G3DJObjectLoader = function(resourceManager) {
    this.resourceManager = resourceManager;
    this.object;
    this.data;
    this.vertexBuffer;
    this.iterator = 0;
};

AURORA.G3DJObjectLoader.prototype = {

    constructor: AURORA.G3DJObjectLoader,

    setWorkData: function(data) {
        this.data = data;
    },

    createVertexBuffer: function(data) {
        this.vertexBuffer = new AURORA.VertexBuffer(8, data.meshes[0].vertices.length / 8, data.meshes[0].vertices,  AURORA.GL.STATIC_DRAW);
    },

    createObject: function(objectNode) {
        this.object = new AURORA.Object3D(objectNode.id, new AURORA.Mesh(this.vertexBuffer, objectNode.id, objectNode.rotation,
                                          objectNode.translation, objectNode.scale)
                                         );
        this.addParts(this.object.mesh, objectNode.parts);

        this.addChildren(this.object.mesh, objectNode);

        return this.object;
    },

    loadObject: function(data) {
        var objectNode = this.findObjectNode(data.nodes);
        if(typeof(objectNode) === "undefined")
            return;

        this.setWorkData(data);
        this.createVertexBuffer(this.data);

        return this.createObject(objectNode);
    },

    loadObjects: function(data) {
        var objectNode = this.findObjectNode(data.nodes);
        if(typeof(objectNode) === "undefined")
            return;

        this.setWorkData(data);
        this.createVertexBuffer(this.data);
        var objects = [];
        this.iterator = 0;

        while(this.iterator < this.data.nodes.length) {
            objectNode = this.getObjectNode(this.data.nodes, this.iterator);

            if(typeof(objectNode) !== "undefined")
                objects.push(this.createObject(objectNode));

            this.iterator++;
        }

        return objects;
    },

    findObjectNode: function(nodes) {
        var node;
        for(var i = 0; i < nodes.length; i++)
            node = this.getObjectNode(nodes, i);

        return node;
    },

    getObjectNode: function(nodes, iterator) {
        if(typeof(nodes[iterator].parts) != "undefined"
            ||
            (typeof(nodes[iterator].children) !== "undefined" && typeof(nodes[iterator].children[0].parts) !== "undefined")
            )
            return nodes[iterator];

        return;
    },
    addChildren: function(parent, node) {
        if(typeof(node.children) === "undefined")
            return;

        for(var i = 0; i < node.children.length; i++) {
            var childMesh = new AURORA.Mesh(this.vertexBuffer, node.children[i].id.toString(), node.children[i].rotation, node.children[i].translation, node.children[i].scale);
            this.addParts(childMesh, node.children[i].parts);
            parent.children.push(childMesh);

            this.addChildren(childMesh, node.children[i]);

        }
    },

    addParts: function(mesh, parts) {
        if(typeof(parts) === "undefined")
            return [];
        for(var i = 0; i < parts.length; i++) {
            for(var j = 0; j < this.data.meshes[0].parts.length; j++) {
                if(parts[i].meshpartid == this.data.meshes[0].parts[j].id) {
                    var meshPart = new AURORA.MeshPart(parts[i].meshpartid, this.createMaterial(parts[i].materialid),
                                                       this.createIndexBuffer(this.data.meshes[0].parts[j].indices));
                    mesh.parts.push(meshPart);
                }
            }
        }
    },

    createMaterial: function(materialId) {
        var regPhong = new RegExp("^phong");
        var regMia = new RegExp("^mia");
        var regLampert = new RegExp("^lambert");

        var MATERIAL_TYPE;
        if(materialId.search(regPhong) != -1)
            MATERIAL_TYPE = AURORA.MATERIAL_TYPES.PHONG;
        else if(materialId.search(regMia) != -1 || materialId.search(regLampert) != -1)
            MATERIAL_TYPE = AURORA.MATERIAL_TYPES.LAMBERT;
        else
            MATERIAL_TYPE = AURORA.MATERIAL_TYPES.LAMBERT;

        for(var i = 0; i < this.data.materials.length; i++) {
            if(materialId == this.data.materials[i].id) {
                var texture;
                if(typeof(this.data.materials[i].textures) !== "undefined")
                    texture = this.resourceManager.loadTexture(this.data.materials[i].textures[0].filename);
                else
                    texture = this.resourceManager.loadTexture("white_texture.png");

                return new AURORA.Material(materialId, MATERIAL_TYPE, this.data.materials[i].diffuse,
                                           this.data.materials[i].specular, this.data.materials[i].ambient, texture);
            }
        }
    },

    createIndexBuffer: function(attributes) {
        return new AURORA.IndexBuffer(1, attributes.length, attributes, AURORA.GL.STATIC_DRAW);
    }

};