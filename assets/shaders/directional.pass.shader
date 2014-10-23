{
    "type": "directional.pass",
    "vertexShader": [
        "precision highp float;",

        "attribute vec3 a_Position;",
        "attribute vec2 a_TexCoord;",

        "varying vec2 v_TexCoord;",

        "vec2 calcTexCoord(vec2 textCoord)",
        "{",
            "return textCoord * 0.5 + vec2(0.5);",
        "}",

        "void main() {",
            "v_TexCoord = calcTexCoord(a_TexCoord);",
            "gl_Position = vec4(a_Position, 1.0);",
        "}"
    ],
    "fragmentShader": [
        "precision highp float;",

        "struct BaseLight {",
            "vec3 color;",
            "float ambientIntensity;",
            "float diffuseIntensity;",
            "float specularPower;",
        "};",

        "struct DirectionalLight {",
            "BaseLight base;",
            "vec3 direction;",
        "};",

        "uniform sampler2D u_DepthTex;",
        "uniform sampler2D u_NormalTex;",
        "uniform sampler2D u_PositionTex;",
        "uniform sampler2D u_ColorTex;",
        "uniform vec3 u_LightDirection;",
        "uniform mat4 u_View;",
        "uniform DirectionalLight u_DirectionalLight;",

        "varying vec2 v_TexCoord;",

        "vec4 calcLightRayColor(BaseLight light, vec3 lightDir, vec3 position, vec3 normal) {",
            "vec4 ambientColor = vec4(light.color, 1.0) * light.ambientIntensity;",
            "vec3 lightDirNormal = normalize(lightDir);",
            "float diffuseFactor = dot(normal, -lightDirNormal);",

            "vec4 diffuseColor = vec4(0.0, 0.0, 0.0, 0.0);",
            "vec4 specularColor = vec4(0.0, 0.0, 0.0, 0.0);",

            "if(diffuseFactor > 0.0) {",
                "diffuseColor = vec4(light.color, 1.0) * light.diffuseIntensity * diffuseFactor;",

                "vec3 vertexToEye = normalize(-position);",
                "vec3 lightReflection = normalize(reflect(lightDirNormal, normal));",

                "float specularFactor = pow(dot(vertexToEye, lightReflection), light.specularPower);",
                "if(specularFactor > 0.0) {",
                    "specularColor = vec4(light.color, 1.0) * specularFactor;",
                "}",
            "}",

            "return ambientColor + diffuseColor + specularColor;",
        "}",

        "vec4 calcDirectionalLight(mat4 view, DirectionalLight light, vec3 position, vec3 normal) {",
            "vec4 lightDir = vec4(u_LightDirection[0], u_LightDirection[1], u_LightDirection[2], 0.0);",

            "vec4 lightDirCameraSpace = view * lightDir;",
            "return calcLightRayColor(light.base, lightDirCameraSpace.xyz, position, normal);",
        "}",

        "void main(void){",
            "vec3 depth = texture2D(u_DepthTex, v_TexCoord).xyz;",
            "vec3 normal = normalize(texture2D(u_NormalTex, v_TexCoord).xyz);",
            "vec3 position = texture2D(u_PositionTex, v_TexCoord).xyz;",
            "vec3 color = texture2D(u_ColorTex, v_TexCoord).xyz;",

            "gl_FragColor = vec4(color, 1.0) * calcDirectionalLight(u_View, u_DirectionalLight, position, normal);",
        "}"
    ]
}