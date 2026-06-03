package com.kozen.kpm.resource.entity;

/** Persistence entity for one configurable enum item. */
public class EnumItemEntity {
    private String id;
    private String enumType;
    private String name;
    private String value;
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
    public String getSemantic() { return semantic; }
    public void setSemantic(String semantic) { this.semantic = semantic; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
