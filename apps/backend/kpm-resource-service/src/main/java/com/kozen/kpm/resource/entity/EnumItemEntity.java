package com.kozen.kpm.resource.entity;

/** Persistence entity for one configurable enum item. */
public class EnumItemEntity {
    private String id;
    private String enumType;
    private String name;
    private String value;
    private String labelZh;
    private String labelEn;
    private String shortLabelZh;
    private String shortLabelEn;
    private String semantic;
    private Boolean active;
    private Integer sortOrder;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEnumType() { return enumType; }
    public void setEnumType(String enumType) { this.enumType = enumType; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    public String getLabelZh() { return labelZh; }
    public void setLabelZh(String labelZh) { this.labelZh = labelZh; }
    public String getLabelEn() { return labelEn; }
    public void setLabelEn(String labelEn) { this.labelEn = labelEn; }
    public String getShortLabelZh() { return shortLabelZh; }
    public void setShortLabelZh(String shortLabelZh) { this.shortLabelZh = shortLabelZh; }
    public String getShortLabelEn() { return shortLabelEn; }
    public void setShortLabelEn(String shortLabelEn) { this.shortLabelEn = shortLabelEn; }
    public String getSemantic() { return semantic; }
    public void setSemantic(String semantic) { this.semantic = semantic; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
