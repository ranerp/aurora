{
    "type": "lambert",
    "vertexShader": [
        "attribute vec3 a_VertexPosition;",
        "attribute vec2 a_TextureCoord;",
        "attribute vec3 a_VertexNormal;",

        "uniform mat4 u_PMatrix;",
        "uniform mat4 u_MVMatrix;",
        "uniform mat3 u_NMatrix;",

        "uniform vec3 u_AmbientColor;",
        "uniform vec3 u_LightColor;",

        "uniform vec3 u_MaterialAmbientColor;",
        "uniform vec3 u_MaterialDiffuseColor;",

        "uniform vec3 u_LightingDirection;",

        "varying vec2 v_TextureCoord;",
        "varying vec3 v_LightWeighting;",

        "void main(void) { ",
            "gl_Position = u_PMatrix * u_MVMatrix * vec4(a_VertexPosition, 1.0);",
            "v_TextureCoord = a_TextureCoord;",

            "vec3 transformedNormal = u_NMatrix * a_VertexNormal;",
            "vec3 materialAmbientColor = u_AmbientColor * u_MaterialAmbientColor;",
            "float directionalLightWeighting = max(dot(transformedNormal, u_LightingDirection), 0.0);",

            "v_LightWeighting = materialAmbientColor + u_LightColor * directionalLightWeighting;",
        "}"
    ],
    "fragmentShader": [
        "precision mediump float;",

        "varying vec2 v_TextureCoord;",
        "varying vec3 v_LightWeighting;",

        "uniform sampler2D u_Sampler;",

        "void main(void) {",
            "vec4 textureColor = texture2D(u_Sampler, vec2(v_TextureCoord.s, v_TextureCoord.t));",
            "gl_FragColor = vec4(textureColor.rgb * v_LightWeighting, textureColor.a);",
        "}"
    ]
}