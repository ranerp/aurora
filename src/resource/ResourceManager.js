if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.ResourceManager = function() {
};

AURORA.ResourceManager.prototype = {

    constructor: AURORA.ResourceManager,

    startUp: function(worldContainer) {
        this.SOUNDPATH = AURORA.COREPATH + "assets/sounds/";
        this.SOUNDFONTPATH = this.SOUNDPATH + "soundfont/";
        this.TRACKPATH = this.SOUNDPATH + "tracks/";

        this.OBJECTPATH = AURORA.COREPATH + "assets/objects/";
        this.TEXTUREPATH = AURORA.COREPATH + "assets/textures/";
        this.SHADERPATH = AURORA.COREPATH + "assets/shaders/";

        this.textureContainer = new AURORA.Map(true);
        this.shaderProgramContainer = new AURORA.Map(true);
        this.worldContainer = worldContainer;

        this.loadShaderPrograms();
    },

    loadSoundFont: function(instrument) {
        this.loadSoundFonts([instrument]);
    },

    loadSoundFonts: function(instruments) {
        MIDI.loadPlugin({
            soundfontUrl: this.SOUNDFONTPATH,
            instruments: instruments,
            callback: this.loadMessage(instruments)
        });
    },

    loadG3DJObject: function(path) {
        if(!this.checkObjectType(path))
            return;

        var self = this;
        jQuery.ajax({
            type: "GET",
            url: self.OBJECTPATH + path,
            async: true,
            success: function(data) {
                self.loadMessage([path]);

                var loader = new AURORA.G3DJObjectLoader(self);
                var object = loader.loadObject(JSON.parse(data));
                if(typeof(object) === "undefined")
                    return;

                self.worldContainer.addObject(object);
            }
        });
    },

    loadG3DJObjects: function(path) {
        if(!this.checkObjectType(path))
            return;

        var self = this;
        jQuery.ajax({
            type: "GET",
            url: self.OBJECTPATH + path,
            async: true,
            success: function(data) {
                self.loadMessage([path]);

                var loader = new AURORA.G3DJObjectLoader(self);
                var objects = loader.loadObjects(JSON.parse(data));
                if(typeof(objects) === "undefined")
                    return;

                self.worldContainer.addObjects(objects);
            }
        });

    },

    loadMap: function(path) {
        if(!this.checkMapType)
            return;

        var self = this;
        jQuery.ajax({
            type: "GET",
            url: self.OBJECTPATH + path,
            async: true,
            success: function(data) {
                var loader = new AURORA.MapLoader(self);

            }
        });
    },

    checkObjectType: function(path) {
        var reg = RegExp(".g3dj$");
        if(path.search(reg) == -1) {
            this.typeError([path]);
            return;
        }

        return true;
    },

    checkMapType: function(path) {
        var reg = RegExp(".map$");
        if(path.search(reg) == -1) {
            this.typeError([path]);
            return;
        }

        return true;
    },

    loadTexture: function(path) {
        var image = new Image();
        var self = this;

        var item = this.textureContainer.get(path);
        if(typeof(item) !== "undefined")
            return item;

        var texture = new AURORA.Texture(path);
        self.textureContainer.put(path, texture);

        image.onload = function() {
            texture.createTexture(image);
            self.loadMessage([path]);
        };
        image.src = this.TEXTUREPATH + path;

        return texture;
    },

    loadSound: function(path) {
        MIDI.Player.loadFile(this.TRACKPATH + path, this.loadMessage([path]));
    },

    loadShaderProgram: function(TYPE) {
        var self = this;

        var item = this.shaderProgramContainer.get(TYPE);
        if(typeof(item) !== "undefined")
            return item;

        var path = TYPE + ".shader";

        jQuery.ajax({
            type: "GET",
            url: self.SHADERPATH + path,
            async: false,
            success: function(data) {
                var loader = new AURORA.ShaderProgramLoader();
                loader.loadShaders(JSON.parse(data));
                var shaderProgram = loader.createProgram(TYPE);

                if(typeof(shaderProgram) !== "undefined")
                    self.shaderProgramContainer.put(shaderProgram.TYPE, shaderProgram);

                return shaderProgram;
            }
        });
    },

    loadShaderPrograms: function() {
        var self = this;

        for(var key in AURORA.SHADER_PROGRAM_TYPE) {
            var path = AURORA.SHADER_PROGRAM_TYPE[key] + ".shader";

            var loader = new AURORA.ShaderProgramLoader();

            jQuery.ajax({
                type: "GET",
                url: self.SHADERPATH + path,
                async: false,
                success: function(data) {
                    loader.loadShaders(JSON.parse(data));
                    var shaderProgram = loader.createProgram(AURORA.SHADER_PROGRAM_TYPE[key]);

                    if(typeof(shaderProgram) !== "undefined")
                        self.shaderProgramContainer.put(shaderProgram.TYPE, shaderProgram);
                }
            });
        }
    },

    loadMessage: function(loadData) {
        for(var i = 0; i < loadData.length; i++) {
            console.log("Loaded: " + loadData[i]);
        }
    },

    typeError: function(loadData) {
        for(var i = 0; i < loadData.length; i++) {
            console.error("Cannot load: " + loadData[i]);
        }
    }
};