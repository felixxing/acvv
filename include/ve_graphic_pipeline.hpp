#ifndef VE_GRAPHIC_PIPELINE_HPP
#define VE_GRAPHIC_PIPELINE_HPP

#include "ve_base.hpp"
#include "ve_device.hpp"
#include "ve_image.hpp"

using VeShaderModuleStage = MultiType<VkShaderModule>;

class VeShaderBase : public VeShaderModuleStage
{
  private:
    std::string entry_point;

  public:
    VkPipelineShaderStageCreateInfo stage_info{};
    void create(VkDevice device, const std::vector<char>& shader_code, const std::string& entry_name,
                VkShaderStageFlagBits stage);
    void destroy(VkDevice device);
};

std::vector<VeImageBase> creat_image_attachments(VeDeviceLayer device_layer, const std::vector<VkFormat>& formats, //
                                                 const std::vector<VkExtent2D>& extends,                           //
                                                 const std::vector<VkSampleCountFlagBits>& samples,                //
                                                 const std::vector<VkImageUsageFlags>& usages,                     //
                                                 const std::vector<VkImageAspectFlags>& aspects);

void destroy_image_attachments(VeDeviceLayer device_layer, std::vector<VeImageBase> attachments);

#endif // VE_GRAPHIC_PIPELINE_HPP
