#version 450 core

layout(location = 0) out vec4 light_result;

layout(input_attachment_index = 0, binding = 0) uniform subpassInput albedo;
layout(input_attachment_index = 1, binding = 1) uniform subpassInput position;
layout(input_attachment_index = 2, binding = 2) uniform subpassInput normal;

layout(push_constant) uniform constants
{
    vec4 position;
    vec4 direction;
    vec4 color;
    vec4 camera_pos;
    float strength;

    float constant;
    float linear;
    float quadratic;
}
light;

void main()
{
    vec3 frag_color = subpassLoad(albedo).rgb;
    vec3 frag_pos = subpassLoad(position).rgb;
    vec3 normal = normalize(subpassLoad(normal).rgb);
    vec3 view_dir = normalize(light.camera_pos.xyz - frag_pos);

    if (light.constant > 0.5)
    {
        vec3 light_dir = normalize(light.position.xyz - frag_pos);
        vec3 half_way = normalize(light_dir + view_dir);

        float diff = max(dot(normal, light_dir), 0.0);
        float spec = pow(max(dot(normal, half_way), 0.0), 32.0);

        float dist = length(light.position.xyz - frag_pos);
        float attenuation = 1.0 / (light.constant + light.linear * dist + light.quadratic * (dist * dist));

        vec3 ambient = frag_color * 0.1;
        vec3 diffuse = diff * frag_color;
        vec3 specular = spec * frag_color;

        light_result = vec4(light.color.xyz * attenuation * light.strength * (ambient + diffuse + specular), 1.0);
    }
    else
    {
        vec3 light_dir = normalize(-light.direction.xyz);
        vec3 half_way = normalize(light_dir + view_dir);

        float diff = max(dot(normal, light_dir), 0.0);
        float spec = pow(max(dot(normal, half_way), 0.0), 32.0);

        vec3 ambient = frag_color * 0.1;
        vec3 diffuse = diff * frag_color;
        vec3 specular = spec * frag_color;

        light_result = vec4(light.color.xyz * light.strength * (ambient + diffuse + specular), 1.0);
    }
}