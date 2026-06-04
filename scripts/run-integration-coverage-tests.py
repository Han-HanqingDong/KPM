#!/usr/bin/env python3
"""KPM front/back integration coverage test.

This script exercises every currently exposed backend REST endpoint and the API
actions used by the React UI buttons. It also verifies representative rows in
PostgreSQL so we know data is actually persisted with expected relationships.
"""

from __future__ import annotations

import json
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Callable


BASE = "http://127.0.0.1:8080"
ROOT = Path("/Users/henry/Documents/KPM")
REPORT_DIR = ROOT / "docs/04-development"
STAMP = datetime.now().strftime("%Y%m%d%H%M%S")
RUN_PREFIX = f"IT{STAMP[-8:]}"
REPORT_MD = REPORT_DIR / f"integration-coverage-report-{STAMP}.md"
REPORT_JSON = REPORT_DIR / f"integration-coverage-results-{STAMP}.json"
ADMIN_ACCOUNT = "admin@kozenmobile.com"
ADMIN_PASSWORD = "123456"


def short_alpha_code(seed: str, length: int = 5) -> str:
    """Create a stable test customer short name that satisfies the 1-5 letter rule."""
    number = int("".join(ch for ch in seed if ch.isdigit())[-8:] or "0")
    chars: list[str] = []
    for _ in range(length):
        chars.append(chr(ord("A") + number % 26))
        number //= 26
    return "".join(reversed(chars))


CUSTOMER_SHORT_NAME = short_alpha_code(STAMP)


class ApiFailure(Exception):
    pass


@dataclass
class CaseResult:
    case_id: str
    module: str
    title: str
    status: str
    detail: str = ""
    endpoint: str = ""
    frontend_action: str = ""


@dataclass
class TestContext:
    token: str = ""
    test_user_token: str = ""
    department: dict[str, Any] = field(default_factory=dict)
    role: dict[str, Any] = field(default_factory=dict)
    user: dict[str, Any] = field(default_factory=dict)
    enum_item: dict[str, Any] = field(default_factory=dict)
    transition: dict[str, Any] = field(default_factory=dict)
    template: dict[str, Any] = field(default_factory=dict)
    project: dict[str, Any] = field(default_factory=dict)
    stage: dict[str, Any] = field(default_factory=dict)
    sku: dict[str, Any] = field(default_factory=dict)
    customer: dict[str, Any] = field(default_factory=dict)
    contact: dict[str, Any] = field(default_factory=dict)
    material: dict[str, Any] = field(default_factory=dict)
    requirement: dict[str, Any] = field(default_factory=dict)
    task: dict[str, Any] = field(default_factory=dict)
    attachment: dict[str, Any] = field(default_factory=dict)
    order: dict[str, Any] = field(default_factory=dict)
    message: dict[str, Any] = field(default_factory=dict)
    project_material_id: str = ""
    portal_token: str = ""


results: list[CaseResult] = []
ctx = TestContext()


def q(value: Any) -> str:
    return urllib.parse.quote(str(value), safe="")


def sql_quote(value: Any) -> str:
    return "'" + str(value).replace("'", "''") + "'"


def api(
    method: str,
    path: str,
    body: Any | None = None,
    *,
    token: str | None = None,
    expect_success: bool = True,
    timeout: int = 30,
    raw_headers: dict[str, str] | None = None,
) -> Any:
    data = None
    headers = dict(raw_headers or {})
    if body is not None:
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json"
    if token is None:
        token = ctx.token
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(BASE + path, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        text = e.read().decode("utf-8", errors="ignore")
        try:
            payload = json.loads(text)
        except Exception:
            payload = {"success": False, "code": f"HTTP_{e.code}", "message": text}
        if expect_success:
            raise ApiFailure(f"{method} {path} HTTP {e.code}: {payload}") from e
        return payload
    except Exception as e:
        raise ApiFailure(f"{method} {path}: {e}") from e
    if expect_success and payload.get("success") is False:
        raise ApiFailure(f"{method} {path}: {payload}")
    return payload.get("data") if payload.get("success") is not False else payload


def upload_file(local_path: Path, category: str, business_id: str, uploader: str = "IntegrationTester") -> dict[str, Any]:
    boundary = f"----KPMIntegrationBoundary{int(time.time() * 1000)}"
    file_bytes = local_path.read_bytes()
    parts: list[bytes] = []

    def field(name: str, value: str) -> None:
        parts.append(
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n{value}\r\n".encode()
        )

    field("category", category)
    field("businessId", business_id)
    field("uploader", uploader)
    parts.append(
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{local_path.name}\"\r\nContent-Type: text/plain\r\n\r\n".encode()
        + file_bytes
        + b"\r\n"
    )
    parts.append(f"--{boundary}--\r\n".encode())
    req = urllib.request.Request(
        BASE + "/api/files/upload",
        data=b"".join(parts),
        method="POST",
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "Authorization": f"Bearer {ctx.token}",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    if payload.get("success") is False:
        raise ApiFailure(f"file upload failed: {payload}")
    return payload["data"]


def psql(sql: str) -> str:
    proc = subprocess.run(
        ["docker", "exec", "-i", "kpm-postgres", "psql", "-U", "kpm", "-d", "kpm", "-At", "-v", "ON_ERROR_STOP=1", "-c", sql],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=ROOT,
    )
    if proc.returncode != 0:
        raise AssertionError(f"SQL failed: {sql}\n{proc.stderr}")
    return proc.stdout.strip()


def db_scalar(sql: str) -> str:
    lines = psql(sql).splitlines()
    return lines[0] if lines else ""


def db_count(table: str, where: str) -> int:
    value = psql(f"select count(*) from {table} where {where};")
    return int(value or "0")


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def assert_db_count(table: str, where: str, expected: int = 1) -> None:
    actual = db_count(table, where)
    assert_true(actual == expected, f"{table} expected count={expected}, actual={actual}, where={where}")


def record(case_id: str, module: str, title: str, status: str, detail: str = "", endpoint: str = "", frontend_action: str = "") -> None:
    results.append(CaseResult(case_id, module, title, status, str(detail)[:1800], endpoint, frontend_action))
    print(f"{status:5} {case_id:16} {module:10} {title} {detail}")


def run_case(case_id: str, module: str, title: str, fn: Callable[[], str], endpoint: str = "", frontend_action: str = "") -> None:
    try:
        detail = fn()
        record(case_id, module, title, "PASS", detail, endpoint, frontend_action)
    except Exception as e:
        record(case_id, module, title, "FAIL", repr(e), endpoint, frontend_action)


def enum_value(enum_items: list[dict[str, Any]], enum_type: str, fallback: str) -> str:
    for item in enum_items:
        if item.get("enumType") == enum_type and item.get("active") is not False:
            return item.get("value") or item.get("name") or fallback
    return fallback


def login_admin() -> str:
    data = api("POST", "/api/iam/login", {"account": ADMIN_ACCOUNT, "password": ADMIN_PASSWORD}, token="")
    token = data.get("token")
    assert_true(bool(token), "admin token missing")
    ctx.token = token
    return f"admin={data['user']['account']}"


def create_base_resources() -> str:
    bootstrap = api("GET", "/api/resources/bootstrap")
    permissions = [p["code"] for p in bootstrap["permissions"] if p.get("code")]
    dept = api("POST", "/api/resources/departments", {"name": f"{RUN_PREFIX}联调部门", "status": "启用"})
    role = api("POST", "/api/resources/roles", {
        "name": f"{RUN_PREFIX}联调角色",
        "roleType": "全局角色",
        "status": "启用",
        "permissions": permissions,
    })
    user_email = f"{RUN_PREFIX.lower()}@kozenmobile.com"
    user = api("POST", "/api/resources/users", {
        "name": f"{RUN_PREFIX}用户",
        "email": user_email,
        "departments": [dept["name"]],
        "globalRoles": [role["name"]],
        "directPermissions": ["menu:dashboard"],
        "status": "启用",
    })
    assert_true(user.get("account") == user_email, "user account should default to email")
    assert_true(user.get("defaultPassword") == "123456", "default password should be returned")
    assert_db_count("kpm_departments", f"id={sql_quote(dept['id'])} and del_flag=0")
    assert_db_count("kpm_roles", f"id={sql_quote(role['id'])} and del_flag=0")
    assert_db_count("kpm_users", f"id={sql_quote(user['id'])} and account={sql_quote(user_email)} and del_flag=0")
    users = api("GET", "/api/resources/users")
    departments = api("GET", "/api/resources/departments")
    roles = api("GET", "/api/resources/roles")
    assert_true(any(item.get("id") == user["id"] for item in users), "created user missing from user list")
    assert_true(any(item.get("id") == dept["id"] for item in departments), "created department missing from department list")
    assert_true(any(item.get("id") == role["id"] for item in roles), "created role missing from role list")
    ctx.department, ctx.role, ctx.user = dept, role, user
    return f"dept={dept['id']} role={role['id']} user={user['id']}"


def update_base_resources() -> str:
    dept = api("PUT", f"/api/resources/departments/{q(ctx.department['id'])}", {"name": f"{RUN_PREFIX}联调部门改", "status": "启用"})
    role = api("PUT", f"/api/resources/roles/{q(ctx.role['id'])}", {
        "name": f"{RUN_PREFIX}联调角色改",
        "roleType": "全局角色",
        "status": "启用",
        "permissions": ["menu:dashboard", "menu:projects", "button:projects:create"],
    })
    user = api("PUT", f"/api/resources/users/{q(ctx.user['id'])}", {
        "name": f"{RUN_PREFIX}用户改",
        "email": ctx.user["email"],
        "departments": [dept["name"]],
        "globalRoles": [role["name"]],
        "directPermissions": ["menu:dashboard", "menu:tasks"],
        "status": "启用",
    })
    reset = api("POST", f"/api/resources/users/{q(ctx.user['id'])}/reset-password", {})
    assert_true(reset.get("defaultPassword") == "123456", "reset should return default password")
    ctx.department, ctx.role, ctx.user = dept, role, user
    assert_db_count("kpm_users", f"id={sql_quote(user['id'])} and name={sql_quote(user['name'])} and del_flag=0")
    return "resource update/reset ok"


def iam_change_password_flow() -> str:
    login = api("POST", "/api/iam/login", {"account": ctx.user["email"], "password": "123456"}, token="")
    ctx.test_user_token = login["token"]
    api("GET", "/api/iam/me", token=ctx.test_user_token)
    api("POST", "/api/iam/change-password", {"oldPassword": "123456", "newPassword": "1234567"}, token=ctx.test_user_token)
    changed = api("POST", "/api/iam/login", {"account": ctx.user["email"], "password": "1234567"}, token="")
    assert_true(bool(changed.get("token")), "new password login failed")
    api("POST", "/api/iam/change-password", {"oldPassword": "1234567", "newPassword": "123456"}, token=changed["token"])
    bad = api("POST", "/api/iam/login", {"account": "not-email", "password": ""}, token="", expect_success=False)
    assert_true(bad.get("success") is False, "invalid login should fail")
    return "me/change-password/login-validation ok"


def enum_and_transition_flow() -> str:
    enum_item = api("POST", "/api/resources/enums", {
        "enumType": "integration_test_enum",
        "name": f"{RUN_PREFIX}枚举",
        "value": f"{RUN_PREFIX}_VALUE",
        "semantic": "TEST",
        "active": True,
        "sortOrder": 999,
    })
    enum_item = api("PUT", f"/api/resources/enums/{q(enum_item['id'])}", {
        "enumType": "integration_test_enum",
        "name": f"{RUN_PREFIX}枚举改",
        "value": f"{RUN_PREFIX}_VALUE2",
        "semantic": "TEST2",
        "active": True,
        "sortOrder": 998,
    })
    transition = api("POST", "/api/resources/task-status-transitions", {"fromStatus": f"{RUN_PREFIX}From", "toStatus": f"{RUN_PREFIX}To"})
    assert_db_count("kpm_enum_items", f"id={sql_quote(enum_item['id'])} and value={sql_quote(enum_item['value'])} and del_flag=0")
    assert_db_count("kpm_task_status_transitions", f"id={sql_quote(transition['id'])} and del_flag=0")
    ctx.enum_item, ctx.transition = enum_item, transition
    return f"enum={enum_item['id']} transition={transition['id']}"


def template_flow() -> str:
    tpl = api("POST", "/api/projects/templates", {
        "name": f"{RUN_PREFIX}流程模板",
        "scope": "联调",
        "status": "启用",
        "stages": [f"{RUN_PREFIX}阶段A", f"{RUN_PREFIX}阶段B"],
    })
    tpl = api("PUT", f"/api/projects/templates/{q(tpl['id'])}", {
        "name": f"{RUN_PREFIX}流程模板改",
        "scope": "联调",
        "status": "启用",
        "stages": [f"{RUN_PREFIX}阶段A", f"{RUN_PREFIX}阶段B", f"{RUN_PREFIX}阶段C"],
    })
    api("GET", "/api/projects/templates")
    assert_true(len(tpl.get("stages") or []) == 3, "template stages not persisted")
    assert_db_count("kpm_process_templates", f"id={sql_quote(tpl['id'])} and del_flag=0")
    ctx.template = tpl
    return f"template={tpl['id']}"


def project_customer_flow() -> str:
    bootstrap = api("GET", "/api/resources/bootstrap")
    enum_items = bootstrap["enumItems"]
    stage_default = enum_value(enum_items, "stage_status", "未开始")
    project = api("POST", "/api/projects", {
        "externalName": f"{RUN_PREFIX}项目",
        "internalName": f"{RUN_PREFIX}-IN",
        "modelName": f"{RUN_PREFIX}-MODEL",
        "managerAccount": ADMIN_ACCOUNT,
        "salesability": "可销售",
        "description": "联调测试项目",
        "members": [{"userAccount": ctx.user["email"], "role": "联调成员"}],
        "stages": [
            {"name": f"{RUN_PREFIX}阶段A", "assignees": [{"type": "user", "account": ADMIN_ACCOUNT}]},
            {"name": f"{RUN_PREFIX}阶段B", "assignees": [{"type": "user", "account": ctx.user["email"]}]},
        ],
    })
    assert_true("status" not in project, "project DTO should not expose project-level status")
    assert_true(project["stages"][0]["status"] == stage_default, "stage default status mismatch")
    projects = api("GET", "/api/projects")
    assert_true(any(item.get("id") == project["id"] for item in projects), "created project missing from project list")
    detail = api("GET", f"/api/projects/{q(project['id'])}")
    assert_true(detail["id"] == project["id"], "project detail id mismatch")
    project = api("PUT", f"/api/projects/{q(project['id'])}", {
        "externalName": f"{RUN_PREFIX}项目改",
        "internalName": f"{RUN_PREFIX}-IN2",
        "modelName": f"{RUN_PREFIX}-MODEL2",
        "managerAccount": ADMIN_ACCOUNT,
        "salesability": "可销售",
        "description": "联调测试项目修改",
        "members": [{"userAccount": ctx.user["email"], "role": "联调成员改"}],
        "stages": [{"id": project["stages"][0]["id"], "name": project["stages"][0]["name"], "assignees": [{"type": "user", "account": ADMIN_ACCOUNT}]}],
    })
    stage = project["stages"][0]
    denied = api("PUT", f"/api/projects/stages/{q(stage['id'])}", {"status": "进行中"}, token=ctx.test_user_token, expect_success=False)
    assert_true(denied.get("success") is False, "non-assignee stage status update should fail")
    project = api("PUT", f"/api/projects/stages/{q(stage['id'])}", {"status": "进行中"})
    stage = next(item for item in project["stages"] if item["id"] == stage["id"])
    project = api("PUT", f"/api/projects/{q(project['id'])}/members", {"members": [{"userAccount": ctx.user["email"], "role": "联调成员保存"}]})
    project = api("PUT", f"/api/projects/stages/{q(stage['id'])}/assignees", {"assignees": [{"type": "user", "account": ADMIN_ACCOUNT}]})
    sku = api("POST", f"/api/projects/{q(project['id'])}/skus", {
        "wholeMachinePartNumber": f"{RUN_PREFIX}-PN-001",
        "configurationName": "联调标准配置",
        "memoryType": "4G+64G",
        "active": True,
    })
    sku = api("PUT", f"/api/projects/{q(project['id'])}/skus/{q(sku['id'])}", {
        "wholeMachinePartNumber": f"{RUN_PREFIX}-PN-002",
        "configurationName": "联调高级配置",
        "memoryType": "8G+128G",
        "active": True,
    })
    api("GET", f"/api/projects/{q(project['id'])}/skus")
    customer = api("POST", "/api/customers", {
        "name": f"{RUN_PREFIX}客户",
        "shortName": CUSTOMER_SHORT_NAME,
        "region": "Shanghai China",
        "address": "Shanghai",
        "level": "C / 普通客户",
        "status": "潜在客户",
        "salesOwners": [ADMIN_ACCOUNT],
        "supportOwners": [ctx.user["email"]],
    })
    customer = api("PUT", f"/api/customers/{q(customer['id'])}", {
        "name": f"{RUN_PREFIX}客户改",
        "shortName": customer["shortName"],
        "region": "Shanghai China",
        "address": "Shanghai Pudong",
        "level": "B / 重点客户",
        "status": "合作中",
        "salesOwners": [ADMIN_ACCOUNT],
        "supportOwners": [ctx.user["email"]],
    })
    customers = api("GET", "/api/customers")
    assert_true(any(item.get("id") == customer["id"] for item in customers), "created customer missing from customer list")
    customer_detail = api("GET", f"/api/customers/{q(customer['id'])}")
    assert_true(customer_detail["id"] == customer["id"], "customer detail id mismatch")
    project = api("POST", f"/api/projects/{q(project['id'])}/customers", {"customerId": customer["id"], "projectStatus": "样机测试"})
    project = api("PUT", f"/api/projects/{q(project['id'])}/customers/{q(customer['id'])}", {"projectStatus": "订单冲刺"})
    assert_db_count("kpm_projects", f"id={sql_quote(project['id'])} and del_flag=0")
    assert_db_count("kpm_project_stages", f"id={sql_quote(stage['id'])} and status='进行中' and del_flag=0")
    assert_db_count("kpm_stage_assignees", f"stage_id={sql_quote(stage['id'])} and account={sql_quote(ADMIN_ACCOUNT)} and del_flag=0")
    assert_db_count("kpm_project_skus", f"id={sql_quote(sku['id'])} and whole_machine_part_number={sql_quote(sku['wholeMachinePartNumber'])} and del_flag=0")
    assert_db_count("kpm_customers", f"id={sql_quote(customer['id'])} and short_name={sql_quote(customer['shortName'])} and del_flag=0")
    assert_db_count("kpm_customer_owners", f"customer_id={sql_quote(customer['id'])} and owner_user_id={sql_quote(ctx.user['id'])} and del_flag=0")
    assert_db_count("kpm_project_customers", f"project_id={sql_quote(project['id'])} and customer_id={sql_quote(customer['id'])} and project_status='订单冲刺' and del_flag=0")
    ctx.project, ctx.stage, ctx.sku, ctx.customer = project, stage, sku, customer
    return f"project={project['id']} customer={customer['id']} sku={sku['id']}"


def customer_detail_flow() -> str:
    contact = api("POST", f"/api/customers/{q(ctx.customer['id'])}/contacts", {
        "name": f"{RUN_PREFIX}联系人",
        "title": "采购经理",
        "phone": "+86-13800138000",
        "email": f"contact-{RUN_PREFIX.lower()}@example.com",
        "remark": "联调联系人",
    })
    ctx.contact = next(item for item in contact["contacts"] if item["name"] == f"{RUN_PREFIX}联系人")
    file_path = Path("/tmp") / f"kpm-{RUN_PREFIX}-customer.txt"
    file_path.write_text(f"customer material {RUN_PREFIX}\n", encoding="utf-8")
    uploaded = upload_file(file_path, "customer-materials", ctx.customer["id"])
    ctx.material = uploaded
    detail = api("POST", f"/api/customers/{q(ctx.customer['id'])}/materials", uploaded)
    followup = api("POST", f"/api/customers/{q(ctx.customer['id'])}/followups", {
        "author": "IntegrationTester",
        "content": f"{RUN_PREFIX}客户跟进",
        "attachments": [uploaded],
    })
    api("GET", f"/api/customers/{q(ctx.customer['id'])}")
    assert_true(any(m.get("objectKey") == uploaded["objectKey"] for m in detail["materials"]), "customer material not returned")
    assert_true(any(f.get("content") == f"{RUN_PREFIX}客户跟进" for f in followup["followups"]), "customer followup not returned")
    assert_db_count("kpm_customer_contacts", f"id={sql_quote(ctx.contact['id'])} and customer_id={sql_quote(ctx.customer['id'])} and del_flag=0")
    assert_db_count("kpm_customer_materials", f"customer_id={sql_quote(ctx.customer['id'])} and object_key={sql_quote(uploaded['objectKey'])} and del_flag=0")
    return f"contact={ctx.contact['id']} file={uploaded['objectKey']}"


def project_detail_extensions_flow() -> str:
    stage_file = Path("/tmp") / f"kpm-{RUN_PREFIX}-stage.txt"
    stage_file.write_text(f"stage material {RUN_PREFIX}\n", encoding="utf-8")
    uploaded = upload_file(stage_file, "project-stage-materials", ctx.stage["id"])
    project = api("POST", f"/api/projects/stages/{q(ctx.stage['id'])}/materials", uploaded)
    stage = next(item for item in project["stages"] if item["id"] == ctx.stage["id"])
    material = next(item for item in stage["materials"] if item.get("objectKey") == uploaded["objectKey"])
    project = api("POST", f"/api/projects/stage-materials/{q(material['id'])}/publish", {})
    api("POST", f"/api/projects/stages/{q(ctx.stage['id'])}/records", {
        "author": "IntegrationTester",
        "content": f"{RUN_PREFIX}阶段记录",
        "attachments": [uploaded],
    })
    requirement = api("POST", f"/api/projects/{q(ctx.project['id'])}/customers/{q(ctx.customer['id'])}/requirements", {
        "title": f"{RUN_PREFIX}需求",
        "userStory": "作为客户我希望联调覆盖需求创建",
        "businessValue": "验证需求和任务联动",
        "acceptance": "需求落库并创建任务",
        "priority": "高",
        "status": "待评估",
        "proposer": ctx.customer["name"],
        "creator": ADMIN_ACCOUNT,
        "createTask": True,
    })
    overview = api("GET", f"/api/projects/{q(ctx.project['id'])}/requirements-overview")
    assert_true(any(item.get("title") == requirement["title"] for item in overview), "requirement overview missing new requirement")
    assert_db_count("kpm_stage_materials", f"id={sql_quote(material['id'])} and stage_id={sql_quote(ctx.stage['id'])} and del_flag=0")
    assert_db_count("kpm_project_materials", f"project_id={sql_quote(ctx.project['id'])} and object_key={sql_quote(uploaded['objectKey'])} and del_flag=0")
    ctx.project_material_id = db_scalar(
        f"select id from kpm_project_materials where project_id={sql_quote(ctx.project['id'])} and object_key={sql_quote(uploaded['objectKey'])} and del_flag=0 limit 1;"
    )
    assert_db_count("kpm_stage_records", f"stage_id={sql_quote(ctx.stage['id'])} and content={sql_quote(f'{RUN_PREFIX}阶段记录')} and del_flag=0")
    assert_db_count("kpm_requirements", f"id={sql_quote(requirement['id'])} and task_id is not null and del_flag=0")
    ctx.requirement = requirement
    return f"requirement={requirement['id']} linkedTask={requirement.get('taskId')}"


def customer_portal_flow() -> str:
    assert_true(bool(ctx.contact.get("email")), "customer contact email missing")
    assert_true(bool(ctx.project_material_id), "project material id missing")

    api("POST", f"/api/projects/{q(ctx.project['id'])}/materials/{q(ctx.project_material_id)}/public", {})
    api("POST", f"/api/projects/{q(ctx.project['id'])}/announcements", {
        "announcementType": "产品EOL公告",
        "title": f"{RUN_PREFIX}EOL公告",
        "content": "联调验证客户门户公告类型展示与消息写入。",
    })
    notification_result = api("POST", f"/api/customers/{q(ctx.customer['id'])}/notifications", {
        "title": f"{RUN_PREFIX}客户通知",
        "content": "联调验证客户详情发送通知。",
    })
    assert_true(notification_result.get("portalMessageCount", 0) >= 1, f"customer notification not written: {notification_result}")
    assert_db_count("kpm_project_materials", f"id={sql_quote(ctx.project_material_id)} and public_visible=true and del_flag=0")
    assert_db_count("kpm_project_announcements", f"project_id={sql_quote(ctx.project['id'])} and title={sql_quote(f'{RUN_PREFIX}EOL公告')} and announcement_type='产品EOL公告' and del_flag=0")
    assert_db_count("kpm_customer_portal_messages", f"customer_id={sql_quote(ctx.customer['id'])} and title={sql_quote(f'客户通知：{RUN_PREFIX}客户通知')} and del_flag=0")

    code_response = api("POST", "/api/customer-portal/request-code", {"email": ctx.contact["email"]}, token="")
    code = code_response.get("debugCode")
    assert_true(bool(code), "customer portal debug code is not enabled in local test environment")
    login = api("POST", "/api/customer-portal/login", {"email": ctx.contact["email"], "code": code}, token="")
    ctx.portal_token = login["token"]
    data = api("GET", "/api/customer-portal/data", token=ctx.portal_token)
    messages = api("GET", "/api/customer-portal/messages", token=ctx.portal_token)
    unread = api("GET", "/api/customer-portal/unread-count", token=ctx.portal_token)
    assert_true(any(item.get("projectId") == ctx.project["id"] for item in data.get("projects", [])), "portal linked project missing")
    assert_true(any(item.get("id") == ctx.project_material_id for item in data.get("materials", [])), "portal public material missing")
    assert_true(any(item.get("announcementType") == "产品EOL公告" and item.get("title") == f"{RUN_PREFIX}EOL公告" for item in data.get("announcements", [])), "portal announcement type missing")
    assert_true(any(item.get("title") == f"客户通知：{RUN_PREFIX}客户通知" for item in messages), "portal customer notification message missing")
    assert_true(unread.get("count", 0) >= 1, f"portal unread count invalid: {unread}")
    if messages:
        api("POST", f"/api/customer-portal/messages/{q(messages[0]['id'])}/read", {}, token=ctx.portal_token)
        api("POST", "/api/customer-portal/messages/read-all", {}, token=ctx.portal_token)
    return f"portal projects={len(data.get('projects', []))} materials={len(data.get('materials', []))} messages={len(messages)}"


def task_flow() -> str:
    bootstrap = api("GET", "/api/resources/bootstrap")
    enum_items = bootstrap["enumItems"]
    task_status = enum_value(enum_items, "task_status", "待处理")
    task_category = enum_value(enum_items, "task_category", "其他")
    priority = enum_value(enum_items, "task_priority", "中")
    task = api("POST", "/api/tasks", {
        "title": f"{RUN_PREFIX}任务",
        "description": "联调任务描述",
        "projectId": ctx.project["id"],
        "stageId": ctx.stage["id"],
        "customerId": ctx.customer["id"],
        "category": task_category,
        "status": task_status,
        "priority": priority,
        "creator": ADMIN_ACCOUNT,
        "expectedCompletionAt": "2026-06-30",
        "source": "联调脚本",
        "blocked": True,
        "assignees": [ctx.user["email"]],
        "participants": [ADMIN_ACCOUNT],
    })
    task = api("PUT", f"/api/tasks/{q(task['id'])}", {
        "title": f"{RUN_PREFIX}任务改",
        "description": "联调任务描述修改",
        "projectId": ctx.project["id"],
        "stageId": ctx.stage["id"],
        "customerId": ctx.customer["id"],
        "category": task_category,
        "status": "进行中",
        "priority": priority,
        "creator": ADMIN_ACCOUNT,
        "expectedCompletionAt": "2026-07-01",
        "source": "联调脚本",
        "blocked": False,
        "assignees": [ctx.user["email"]],
        "participants": [ADMIN_ACCOUNT],
    })
    task_file = Path("/tmp") / f"kpm-{RUN_PREFIX}-task.txt"
    task_file.write_text(f"task attachment {RUN_PREFIX}\n", encoding="utf-8")
    uploaded = upload_file(task_file, "task-attachments", task["id"])
    task = api("POST", f"/api/tasks/{q(task['id'])}/attachments", uploaded)
    attachment = next(item for item in task["attachments"] if item.get("objectKey") == uploaded["objectKey"])
    task = api("POST", f"/api/tasks/{q(task['id'])}/comments", {
        "author": "IntegrationTester",
        "content": f"{RUN_PREFIX}任务评论",
        "attachments": [uploaded],
    })
    api("GET", "/api/tasks")
    api("GET", f"/api/tasks/{q(task['id'])}")
    assert_db_count("kpm_tasks", f"id={sql_quote(task['id'])} and customer_id={sql_quote(ctx.customer['id'])} and del_flag=0")
    assert_db_count("kpm_task_assignees", f"task_id={sql_quote(task['id'])} and user_id={sql_quote(ctx.user['id'])} and del_flag=0")
    assert_db_count("kpm_task_attachments", f"id={sql_quote(attachment['id'])} and task_id={sql_quote(task['id'])} and del_flag=0")
    assert_db_count("kpm_task_comments", f"task_id={sql_quote(task['id'])} and content={sql_quote(f'{RUN_PREFIX}任务评论')} and del_flag=0")
    ctx.task, ctx.attachment = task, attachment
    return f"task={task['id']} taskNo={task.get('taskNo')}"


def order_flow() -> str:
    order = api("POST", "/api/orders", {
        "orderDate": "2026-06-04",
        "customerId": ctx.customer["id"],
        "projectId": ctx.project["id"],
        "skuId": ctx.sku["id"],
        "orderType": "正式订单",
        "status": "已创建",
        "quantity": 3,
        "specification": "联调订单规格",
        "expectedShipDate": "2026-07-10",
        "plannedShipDate": "",
        "softwareVersion": "v-it-1",
        "currency": "USD",
        "unitPrice": "10.50",
        "creator": ADMIN_ACCOUNT,
    })
    assert_true(float(order["amount"]) == 31.5, f"amount mismatch {order['amount']}")
    order = api("PUT", f"/api/orders/{q(order['id'])}", {
        "orderDate": "2026-06-04",
        "customerId": ctx.customer["id"],
        "projectId": ctx.project["id"],
        "skuId": ctx.sku["id"],
        "orderType": "正式订单",
        "status": "已发货",
        "quantity": 4,
        "specification": "联调订单规格修改",
        "expectedShipDate": "2026-07-10",
        "plannedShipDate": "2026-07-08",
        "softwareVersion": "v-it-2",
        "currency": "USD",
        "unitPrice": "10.50",
        "creator": ADMIN_ACCOUNT,
        "modifier": "IntegrationTester",
        "changeSummary": "数量和状态修改",
        "changeReason": "联调验证修改记录",
    })
    api("GET", "/api/orders")
    api("GET", f"/api/orders/{q(order['id'])}")
    assert_true(float(order["amount"]) == 42.0, f"updated amount mismatch {order['amount']}")
    assert_true(order.get("actualShipDate") is not None, "actualShipDate should be set when status is shipped")
    assert_true(order.get("histories"), "order history missing")
    assert_db_count("kpm_orders", f"id={sql_quote(order['id'])} and quantity=4 and amount=42.00 and del_flag=0")
    assert_db_count("kpm_order_histories", f"order_id={sql_quote(order['id'])} and reason={sql_quote('联调验证修改记录')} and del_flag=0")
    ctx.order = order
    return f"order={order['id']} amount={order['amount']}"


def analytics_and_file_flow() -> str:
    api("GET", "/api/analytics/dashboard")
    api("GET", "/api/analytics/orders?targetCurrency=USD")
    api("GET", "/api/analytics/resource-map")
    api("GET", f"/api/analytics/support?customerId={q(ctx.customer['id'])}")
    api("GET", "/api/analytics/activity")
    oss = api("GET", "/api/files/oss/status")
    dl = api("GET", f"/api/files/download-url?objectKey={q(ctx.material['objectKey'])}&fileName={q(ctx.material['fileName'])}")
    assert_true("url" in dl, "download url missing")
    return f"ossReady={oss.get('ready')} downloadUrl=yes"


def notification_flow() -> str:
    # Trigger pending event processing; scheduled jobs are async, so nudge the service by waiting briefly.
    time.sleep(2)
    api("GET", "/api/notifications/settings")
    messages = api("GET", "/api/notifications/messages")
    api("GET", "/api/notifications/unread-count")
    if messages:
        ctx.message = messages[0]
        api("POST", f"/api/notifications/messages/{q(ctx.message['id'])}/read", {})
        assert_db_count("kpm_internal_messages", f"id={sql_quote(ctx.message['id'])} and read_flag=true and del_flag=0")
    api("POST", "/api/notifications/messages/read-all", {})
    return f"messages={len(messages)}"


def service_info_flow() -> str:
    endpoints = [
        "/api/iam/ping",
        "/api/resources/ping",
        "/api/projects/ping",
        "/api/customers/ping",
        "/api/tasks/ping",
        "/api/orders/ping",
        "/api/files/ping",
        "/api/analytics/ping",
        "/api/integrations/ping",
        "/api/notifications/service-info",
    ]
    for endpoint in endpoints:
        api("GET", endpoint)
    return f"service endpoints={len(endpoints)}"


def cleanup_flow() -> str:
    deleted = []
    # Exercise delete endpoints and verify logical deletion. Keep dependency order safe.
    if ctx.attachment:
        api("DELETE", f"/api/tasks/{q(ctx.task['id'])}/attachments/{q(ctx.attachment['id'])}")
        assert_db_count("kpm_task_attachments", f"id={sql_quote(ctx.attachment['id'])} and del_flag=1")
        deleted.append("task_attachment")
    if ctx.task:
        api("DELETE", f"/api/tasks/{q(ctx.task['id'])}")
        assert_db_count("kpm_tasks", f"id={sql_quote(ctx.task['id'])} and del_flag=1")
        deleted.append("task")
    linked_requirement_task_id = ctx.requirement.get("taskId") if ctx.requirement else None
    if linked_requirement_task_id and (not ctx.task or linked_requirement_task_id != ctx.task.get("id")):
        api("DELETE", f"/api/tasks/{q(linked_requirement_task_id)}")
        assert_db_count("kpm_tasks", f"id={sql_quote(linked_requirement_task_id)} and del_flag=1")
        deleted.append("linked_requirement_task")
    if ctx.requirement:
        api("POST", f"/api/projects/requirements/{q(ctx.requirement['id'])}/void", {})
        api("DELETE", f"/api/projects/requirements/{q(ctx.requirement['id'])}")
        assert_db_count("kpm_requirements", f"id={sql_quote(ctx.requirement['id'])} and del_flag=1")
        deleted.append("requirement")
    if ctx.order:
        api("DELETE", f"/api/orders/{q(ctx.order['id'])}")
        assert_db_count("kpm_orders", f"id={sql_quote(ctx.order['id'])} and del_flag=1")
        deleted.append("order")
    if ctx.sku:
        api("DELETE", f"/api/projects/{q(ctx.project['id'])}/skus/{q(ctx.sku['id'])}")
        assert_db_count("kpm_project_skus", f"id={sql_quote(ctx.sku['id'])} and del_flag=1")
        deleted.append("sku")
    if ctx.contact:
        api("DELETE", f"/api/customers/{q(ctx.customer['id'])}/contacts/{q(ctx.contact['id'])}")
        assert_db_count("kpm_customer_contacts", f"id={sql_quote(ctx.contact['id'])} and del_flag=1")
        deleted.append("contact")
    if ctx.project:
        api("POST", f"/api/projects/{q(ctx.project['id'])}/archive", {"archived": True})
        assert_db_count("kpm_projects", f"id={sql_quote(ctx.project['id'])} and archived=true and del_flag=0")
        api("DELETE", f"/api/projects/{q(ctx.project['id'])}")
        assert_db_count("kpm_projects", f"id={sql_quote(ctx.project['id'])} and del_flag=1")
        deleted.append("project")
    if ctx.customer:
        api("DELETE", f"/api/customers/{q(ctx.customer['id'])}")
        assert_db_count("kpm_customers", f"id={sql_quote(ctx.customer['id'])} and del_flag=1")
        deleted.append("customer")
    if ctx.template:
        api("DELETE", f"/api/projects/templates/{q(ctx.template['id'])}")
        assert_db_count("kpm_process_templates", f"id={sql_quote(ctx.template['id'])} and del_flag=1")
        deleted.append("template")
    if ctx.transition:
        api("DELETE", f"/api/resources/task-status-transitions/{q(ctx.transition['id'])}")
        assert_db_count("kpm_task_status_transitions", f"id={sql_quote(ctx.transition['id'])} and del_flag=1")
        deleted.append("transition")
    if ctx.enum_item:
        api("DELETE", f"/api/resources/enums/{q(ctx.enum_item['id'])}")
        assert_db_count("kpm_enum_items", f"id={sql_quote(ctx.enum_item['id'])} and del_flag=1")
        deleted.append("enum")
    if ctx.user:
        api("DELETE", f"/api/resources/users/{q(ctx.user['id'])}")
        assert_db_count("kpm_users", f"id={sql_quote(ctx.user['id'])} and del_flag=1")
        deleted.append("user")
    if ctx.role:
        api("DELETE", f"/api/resources/roles/{q(ctx.role['id'])}")
        assert_db_count("kpm_roles", f"id={sql_quote(ctx.role['id'])} and del_flag=1")
        deleted.append("role")
    if ctx.department:
        api("DELETE", f"/api/resources/departments/{q(ctx.department['id'])}")
        assert_db_count("kpm_departments", f"id={sql_quote(ctx.department['id'])} and del_flag=1")
        deleted.append("department")
    return ",".join(deleted)


def frontend_button_api_audit() -> str:
    api_calls = sorted(set(
        line.strip()
        for path in (ROOT / "apps/frontend/kpm-web/src").rglob("*.tsx")
        for line in path.read_text(encoding="utf-8").splitlines()
        if "kpmApi." in line
    ))
    assert_true(api_calls, "no frontend kpmApi calls found")
    # Report-only static audit: backend actions are covered by runtime cases above.
    return f"frontend kpmApi action lines={len(api_calls)}"


def write_reports() -> None:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    passed = sum(1 for r in results if r.status == "PASS")
    failed = sum(1 for r in results if r.status == "FAIL")
    data = {
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "baseUrl": BASE,
        "prefix": RUN_PREFIX,
        "summary": {"passed": passed, "failed": failed, "total": len(results)},
        "results": [r.__dict__ for r in results],
    }
    REPORT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [
        f"# KPM 前后端联调覆盖测试报告 - {STAMP}",
        "",
        f"- 测试地址：`{BASE}`",
        f"- 测试数据前缀：`{RUN_PREFIX}`",
        f"- 结果：**{passed} PASS / {failed} FAIL / {len(results)} TOTAL**",
        "",
        "## 覆盖说明",
        "",
        "- 覆盖 React 前端中调用 `kpmApi` 的主要按钮/动作：新增、编辑、删除、归档、上传、下载、状态修改、评论、消息已读、密码修改等。",
        "- 覆盖当前后端所有 Controller 暴露的业务 REST 接口和 service-info/ping 接口。",
        "- 对核心写接口均做 PostgreSQL 直查：确认数据落库、关联 ID 正确、金额/状态/附件/修改记录正确、删除为逻辑删除。",
        "",
        "## 明细",
        "",
        "| Case | 模块 | 状态 | 接口/动作 | 说明 |",
        "| --- | --- | --- | --- | --- |",
    ]
    for r in results:
        endpoint = r.endpoint or r.frontend_action or "-"
        lines.append(f"| `{r.case_id}` | {r.module} | **{r.status}** | `{endpoint}` | {r.title}：{r.detail.replace('|', '/')} |")
    REPORT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"\nReport: {REPORT_MD}")
    print(f"JSON:   {REPORT_JSON}")


def main() -> int:
    run_case("IAM-001", "身份", "管理员登录", login_admin, "POST /api/iam/login", "登录按钮")
    if not ctx.token:
        write_reports()
        return 1
    run_case("SVC-001", "服务", "所有服务健康接口", service_info_flow, "GET /api/*/ping")
    run_case("RES-001", "资源", "部门/角色/用户新增并落库", create_base_resources, "POST /api/resources/*", "资源管理新增按钮")
    run_case("RES-002", "资源", "部门/角色/用户修改和重置密码", update_base_resources, "PUT/POST /api/resources/*", "资源管理编辑/重置按钮")
    run_case("IAM-002", "身份", "当前用户、修改密码、登录校验", iam_change_password_flow, "GET /api/iam/me; POST /api/iam/change-password", "左下角修改密码入口")
    run_case("RES-003", "资源", "枚举和任务状态流转 CRUD", enum_and_transition_flow, "POST/PUT/DELETE /api/resources/enums; /task-status-transitions", "枚举/流转按钮")
    run_case("TPL-001", "模板", "流程模板新增修改查询", template_flow, "GET/POST/PUT /api/projects/templates", "流程模板按钮")
    run_case("PROJ-001", "项目客户", "项目、阶段、SKU、客户、关联客户全链路", project_customer_flow, "POST/PUT /api/projects; /customers; /skus", "项目/客户/SKU按钮")
    run_case("CUST-001", "客户", "联系人、客户资料、跟进记录", customer_detail_flow, "POST /api/customers/{id}/contacts|materials|followups", "客户详情按钮")
    run_case("PROJ-002", "项目", "阶段资料、发布、阶段记录、需求", project_detail_extensions_flow, "POST /api/projects/stages/*; /requirements", "阶段详情/需求按钮")
    run_case("PORTAL-001", "客户门户", "公告类型、客户通知、公开资料和门户登录", customer_portal_flow, "POST /api/projects/{id}/announcements; /api/customers/{id}/notifications; /api/customer-portal/*", "项目公告/客户通知/客户门户")
    run_case("TASK-001", "任务", "任务新增修改附件评论", task_flow, "GET/POST/PUT /api/tasks", "任务管理/阶段任务按钮")
    run_case("ORD-001", "订单", "订单新增修改历史和金额", order_flow, "GET/POST/PUT /api/orders", "订单管理按钮")
    run_case("ANA-001", "统计文件", "统计看板和文件下载地址", analytics_and_file_flow, "GET /api/analytics/*; /api/files/*", "统计看板/下载按钮")
    run_case("MSG-001", "消息", "消息查询和已读", notification_flow, "GET/POST /api/notifications/*", "消息盒子按钮")
    run_case("UI-001", "前端", "前端 kpmApi 按钮动作静态覆盖", frontend_button_api_audit, frontend_action="React kpmApi actions")
    run_case("CLEAN-001", "清理", "删除接口和逻辑删除校验", cleanup_flow, "DELETE/POST archive endpoints", "删除/归档按钮")
    write_reports()
    return 0 if all(r.status == "PASS" for r in results) else 1


if __name__ == "__main__":
    sys.exit(main())
