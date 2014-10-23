{
    "type": "geometry.pass",
    "vertexShader": [
        "precision highp float;",

        "attribute vec3 a_Position;",
        "attribute vec3 a_Normal;",
        "attribute vec2 a_TexCoord;",

        "uniform mat4 u_Model;",
        "uniform mat4 u_View;",
        "uniform mat4 u_Perspective;",
        "uniform mat3 u_ITNormal;",

        "varying vec4 v_Position;",
        "varying vec3 v_Normal;",
        "varying vec2 v_TexCoord;",
        "varying float v_Depth;",

        "void main() {",
            "vec4 cameraSpace = u_View * u_Model * vec4(a_Position, 1.0);",
            "vec4 homogeneousSpace = u_Perspective * cameraSpace;",

            "gl_Position = homogeneousSpace;",
            "v_Position = cameraSpace;",
            "v_Normal = u_ITNormal * a_Normal;",
            "v_TexCoord = a_TexCoord;",
            "v_Depth = homogeneousSpace.z;",
        "}"
    ],
    "fragmentShader": [
        "#extension GL_EXT_draw_buffers : require \n",
        "precision highp float;",

        "uniform sampler2D u_Texture;",

        "varying vec4 v_Position;",
        "varying vec3 v_Normal;",
        "varying vec2 v_TexCoord;",
        "varying float v_Depth;",

        "void main(void){",
            "gl_FragData[0] = vec4(vec3(v_Depth), 1.0);",
            "gl_FragData[1] = vec4(normalize(v_Normal), 1.0);",
            "gl_FragData[2] = v_Position;",
            "gl_FragData[3] = vec4(texture2D(u_Texture, v_TexCoord).xyz, 1.0);",
        "}"
    ]
}