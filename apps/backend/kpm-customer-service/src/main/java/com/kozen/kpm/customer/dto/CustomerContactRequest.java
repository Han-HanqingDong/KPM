package com.kozen.kpm.customer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.LinkedHashMap;
import java.util.Map;

@Schema(description = "客户联系人保存请求")
public record CustomerContactRequest(
        @NotBlank(message = "联系人姓名不能为空")
        @Size(max = 60, message = "联系人姓名不能超过60个字符")
        String name,
        @Size(max = 80, message = "联系人职位不能超过80个字符")
        String title,
        @Size(min = 4, max = 32, message = "联系人电话长度必须在4到32个字符之间")
        String phone,
        @Email(message = "联系人邮箱格式不正确")
        @Size(max = 128, message = "联系人邮箱不能超过128个字符")
        String email,
        @Size(max = 500, message = "联系人备注不能超过500个字符")
        String remark
) {
    public Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("name", name);
        map.put("title", title);
        map.put("phone", phone);
        map.put("email", email);
        map.put("remark", remark);
        return map;
    }
}
