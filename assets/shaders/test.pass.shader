{
    "type": "test.pass",
    "vertexShader": [
        "precision highp float;",

        "attribute vec3 a_Position;",
        "attribute vec2 a_TexCoord;",

        "varying vec2 v_TexCoord;",

        "vec2 calcTexCoord(vec2 texCoord)",
        "{",
            "return texCoord * 0.5 + vec2(0.5);",
        "}",

        "void main() {",
            "v_TexCoord = calcTexCoord(a_TexCoord);",
            "gl_Position = vec4(a_Position, 1.0);",
        "}"
    ],
    "fragmentShader": [
        "precision highp float;",

        "uniform sampler2D u_PositionTex;",
        "uniform sampler2D u_NormalTex;",
        "uniform sampler2D u_DepthTex;",
        "uniform sampler2D u_ColorTex;",

        "varying vec2 v_TexCoord;",

        "void main(void){",
            "vec3 depth = texture2D(u_DepthTex, v_TexCoord).xyz;",
            "vec3 normal = normalize(texture2D(u_NormalTex, v_TexCoord).xyz);",
            "vec3 position = texture2D(u_PositionTex, v_TexCoord).xyz;",
            "vec3 color = texture2D(u_ColorTex, v_TexCoord).xyz;",

            "gl_FragColor = vec4(color, 1.0);",
        "}"
    ]
}