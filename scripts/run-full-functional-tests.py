#!/usr/bin/env python3
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from datetime import datetime

BASE = 'http://127.0.0.1:8080'
FRONTEND = 'http://127.0.0.1:5175/'
ROOT = Path('/Users/henry/Documents/KPM')
STAMP = datetime.now().strftime('%Y%m%d%H%M%S')
REPORT_PATH = ROOT / 'docs/04-development/full-functional-test-report-20260601.md'
JSON_PATH = ROOT / 'docs/04-development/full-functional-test-results-20260601.json'
APP_JS = ROOT / 'apps/frontend/kpm-web/public/prototype-runtime/app.js'

results = []
cleanup = []
context = {}

class ApiFailure(Exception):
    pass

def now():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def record(case_id, module, title, status, detail='', priority='P1'):
    results.append({
        'caseId': case_id,
        'module': module,
        'title': title,
        'priority': priority,
        'status': status,
        'detail': str(detail or '')[:1000],
    })
    print(f"{status:5} {case_id:12} {title} {detail}")

def pass_case(case_id, module, title, detail='', priority='P1'):
    record(case_id, module, title, 'PASS', detail, priority)

def fail_case(case_id, module, title, error, priority='P1'):
    record(case_id, module, title, 'FAIL', error, priority)

def skip_case(case_id, module, title, reason, priority='P2'):
    record(case_id, module, title, 'SKIP', reason, priority)

def api(method, path, body=None, expect_success=True, timeout=30, headers=None):
    data = None
    headers = dict(headers or {})
    if body is not None:
        data = json.dumps(body, ensure_ascii=False).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(BASE + path, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            payload = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        text = e.read().decode('utf-8', errors='ignore')
        if not expect_success:
            try:
                return json.loads(text)
            except Exception:
                return {'success': False, 'code': f'HTTP_{e.code}', 'message': text}
        raise ApiFailure(f'{method} {path} HTTP {e.code}: {text}') from e
    except Exception as e:
        raise ApiFailure(f'{method} {path}: {e}') from e
    if expect_success and payload.get('success') is False:
        raise ApiFailure(f'{method} {path}: {payload}')
    return payload.get('data') if payload.get('success') is not False else payload

def q(value):
    return urllib.parse.quote(str(value), safe='')

def upload_file(local_path, category, business_id, uploader='Codex'):
    boundary = '----KPMFunctionalBoundary%08x' % int(time.time() * 1000)
    path = Path(local_path)
    file_bytes = path.read_bytes()
    parts = []
    def field(name, value):
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode())
    field('category', category)
    field('businessId', business_id)
    field('uploader', uploader)
    parts.append(
        f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{path.name}"\r\nContent-Type: text/plain\r\n\r\n'.encode()
        + file_bytes + b'\r\n'
    )
    parts.append(f'--{boundary}--\r\n'.encode())
    req = urllib.request.Request(
        BASE + '/api/files/upload',
        data=b''.join(parts),
        method='POST',
        headers={'Content-Type': f'multipart/form-data; boundary={boundary}'},
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        payload = json.loads(resp.read().decode('utf-8'))
    if payload.get('success') is False:
        raise ApiFailure(f'OSS upload failed: {payload}')
    return payload['data']

def try_case(case_id, module, title, func, priority='P1'):
    try:
        detail = func()
        pass_case(case_id, module, title, detail, priority)
    except Exception as e:
        fail_case(case_id, module, title, repr(e), priority)

def contains_any(text, values):
    return any(value in text for value in values)

def first_by(items, key, value):
    for item in items:
        if item.get(key) == value:
            return item
    return None

def cleanup_api():
    for kind, value in reversed(cleanup):
        try:
            if kind == 'order':
                api('DELETE', f'/api/orders/{urllib.parse.quote(value)}')
            elif kind == 'task':
                api('DELETE', f'/api/tasks/{urllib.parse.quote(value)}')
            elif kind == 'requirement':
                api('DELETE', f'/api/projects/requirements/{urllib.parse.quote(value)}')
            elif kind == 'project':
                api('DELETE', f'/api/projects/{urllib.parse.quote(value)}')
            elif kind == 'customer':
                api('DELETE', f'/api/customers/{urllib.parse.quote(value)}')
            elif kind == 'user':
                api('DELETE', f'/api/resources/users/{urllib.parse.quote(value)}')
            elif kind == 'role':
                api('DELETE', f'/api/resources/roles/{urllib.parse.quote(value)}')
            elif kind == 'department':
                api('DELETE', f'/api/resources/departments/{urllib.parse.quote(value)}')
            elif kind == 'enum':
                api('DELETE', f'/api/resources/enums/{urllib.parse.quote(value)}')
            elif kind == 'transition':
                api('DELETE', f'/api/resources/task-status-transitions/{urllib.parse.quote(value)}')
            elif kind == 'template':
                api('DELETE', f'/api/projects/templates/{urllib.parse.quote(value)}')
            print(f'CLEANUP {kind} {value}')
        except Exception as e:
            print(f'CLEANUP_FAIL {kind} {value} {e}')

def run():
    print('KPM full functional test started at', now())

    # Basic environment, frontend and docs.
    try_case('SMOKE-001', '环境', '前端页面可访问', lambda: 'frontend ok' if '<div id="root">' in urllib.request.urlopen(FRONTEND, timeout=10).read(2000).decode('utf-8', 'ignore') else (_ for _ in ()).throw(AssertionError('root missing')), 'P0')
    try_case('API-000', '环境', '网关可访问', lambda: api('GET', '/api/resources/ping')['service'], 'P0')
    try_case('FILE-001', '文件', 'OSS 配置状态 ready', lambda: (lambda d: f"bucket={d['bucket']} root={d['rootPrefix']}" if d.get('ready') and d.get('enabled') else (_ for _ in ()).throw(AssertionError(d)))(api('GET', '/api/files/oss/status')), 'P0')
    try_case('DOC-001', '接口文档', '各服务 OpenAPI 文档可访问', check_openapi, 'P0')

    # IAM.
    try_case('LOGIN-001', '登录', '正确账号密码登录', lambda: 'token ok' if api('POST', '/api/iam/login', {'account': 'zhangmin', 'password': '123456'}).get('token') else (_ for _ in ()).throw(AssertionError('no token')), 'P0')
    try_case('LOGIN-002', '登录', '账号或密码为空应失败', lambda: 'failed as expected' if api('POST', '/api/iam/login', {'account': '', 'password': ''}, expect_success=False).get('success') is False else (_ for _ in ()).throw(AssertionError('unexpected success')), 'P1')
    try_case('LOGIN-003', '登录', '错误密码应失败', lambda: 'failed as expected' if api('POST', '/api/iam/login', {'account': 'zhangmin', 'password': 'wrong'}, expect_success=False).get('success') is False else (_ for _ in ()).throw(AssertionError('unexpected success')), 'P1')
    try_case('PERM-004', '权限', '当前用户权限聚合', lambda: (lambda d: f"permissions={len(d.get('permissions', []))}" if d.get('permissions') is not None else (_ for _ in ()).throw(AssertionError(d)))(api('GET', '/api/iam/me?account=zhangmin')), 'P1')

    # Resource bootstrap and CRUD.
    bootstrap = api('GET', '/api/resources/bootstrap')
    context['bootstrap'] = bootstrap
    permissions = bootstrap.get('permissions', [])
    first_permission = permissions[0]['code'] if permissions else None
    try_case('RES-011', '资源管理', '权限目录只读数据存在', lambda: f"permissions={len(permissions)}" if permissions else (_ for _ in ()).throw(AssertionError('no permissions')), 'P0')
    try_case('RES-012', '资源管理', '菜单权限真实来源', lambda: f"menu={sum(1 for p in permissions if '菜单' in str(p.get('permissionType')))}" if any('菜单' in str(p.get('permissionType')) for p in permissions) else (_ for _ in ()).throw(AssertionError('no menu permissions')), 'P1')
    try_case('RES-013', '资源管理', '按钮权限真实来源', lambda: f"button={sum(1 for p in permissions if '按钮' in str(p.get('permissionType')))}" if any('按钮' in str(p.get('permissionType')) for p in permissions) else (_ for _ in ()).throw(AssertionError('no button permissions')), 'P1')

    dept_name = f'TEST-AUTO部门-{STAMP}'
    dept_new_name = f'TEST-AUTO部门改-{STAMP}'
    def resource_dept_flow():
        dept = api('POST', '/api/resources/departments', {'name': dept_name, 'status': '启用'})
        cleanup.append(('department', dept['id']))
        updated = api('PUT', f"/api/resources/departments/{q(dept['id'])}", {'name': dept_new_name, 'status': '启用'})
        context['dept'] = updated
        return updated['name']
    try_case('RES-002/007', '资源管理', '部门新增修改且平铺展示', resource_dept_flow, 'P1')

    role_name = f'TEST-AUTO角色-{STAMP}'
    role_new_name = f'TEST-AUTO角色改-{STAMP}'
    def resource_role_flow():
        role = api('POST', '/api/resources/roles', {'name': role_name, 'roleType': '项目内角色', 'status': '启用', 'permissions': [first_permission] if first_permission else []})
        cleanup.append(('role', role['id']))
        updated = api('PUT', f"/api/resources/roles/{q(role['id'])}", {'name': role_new_name, 'roleType': '项目内角色', 'status': '启用', 'permissions': [first_permission] if first_permission else []})
        context['role'] = updated
        return updated['name']
    try_case('RES-009/010', '资源管理', '角色新增修改与授权', resource_role_flow, 'P1')

    account = f'testauto{STAMP}'
    def resource_user_flow():
        user = api('POST', '/api/resources/users', {'account': account, 'name': f'TEST-AUTO用户-{STAMP}', 'status': '启用', 'departments': [dept_new_name], 'globalRoles': [role_new_name], 'directPermissions': [first_permission] if first_permission else []})
        cleanup.append(('user', user['id']))
        assert dept_new_name in user.get('departments', []), user
        assert role_new_name in user.get('globalRoles', []), user
        if first_permission:
            assert first_permission in user.get('directPermissions', []), user
        depts = api('GET', '/api/resources/departments')
        found = first_by(depts, 'id', context['dept']['id'])
        assert found and int(found.get('userCount', 0)) >= 1, found
        return f"user={user['account']} deptUserCount={found.get('userCount')}"
    try_case('RES-003/004/005/008', '资源管理', '用户部门/角色/直接权限联动与部门人数自动统计', resource_user_flow, 'P1')

    task_status = f'TEST状态-{STAMP}'
    def enum_flow():
        enum = api('POST', '/api/resources/enums', {'enumType': 'task_status', 'name': task_status, 'value': task_status, 'semantic': 'test', 'active': True, 'sortOrder': 999})
        cleanup.append(('enum', enum['id']))
        updated = api('PUT', f"/api/resources/enums/{q(enum['id'])}", {'name': task_status, 'value': task_status, 'semantic': 'test-updated', 'active': True, 'sortOrder': 998})
        context['task_status_enum'] = updated
        transition = api('POST', '/api/resources/task-status-transitions', {'fromStatus': '待处理', 'toStatus': task_status})
        cleanup.append(('transition', transition['id']))
        context['transition'] = transition
        boot2 = api('GET', '/api/resources/bootstrap')
        assert any(e.get('value') == task_status for e in boot2.get('enumItems', [])), 'enum not in bootstrap'
        assert any(t.get('toStatus') == task_status for t in boot2.get('taskStatusTransitions', [])), 'transition not in bootstrap'
        return f"enum={updated['value']} transition={transition['id']}"
    try_case('RES-017/018', '资源管理', '任务状态枚举与状态流转配置联动', enum_flow, 'P0')

    # Customer flow.
    customer_name = f'TEST-AUTO客户-{STAMP}'
    def customer_flow():
        customer = api('POST', '/api/customers', {
            'name': customer_name,
            'shortName': f'TA-CUST-{STAMP}',
            'region': 'Smoke Region',
            'level': 'C / 普通客户',
            'status': '潜在客户',
            'salesOwners': ['张敏', '李娜'],
            'supportOwners': ['王工', '赵工'],
        })
        cleanup.append(('customer', customer['id']))
        assert len(customer.get('salesOwners', [])) >= 2 and len(customer.get('supportOwners', [])) >= 2, customer
        updated = api('PUT', f"/api/customers/{q(customer['id'])}", {
            'name': customer_name + '-改',
            'shortName': f'TA-CUST-UP-{STAMP}',
            'region': 'Smoke Region Updated',
            'level': 'B / 重点客户',
            'status': '活跃客户',
            'salesOwners': ['张敏'],
            'supportOwners': ['王工'],
        })
        context['customer'] = updated
        return f"customer={updated['id']} sales={updated.get('salesOwners')} support={updated.get('supportOwners')}"
    try_case('CUST-001/003/005/006/007', '客户', '客户新增修改与销售/技术支持多人负责人', customer_flow, 'P0')

    def customer_contact_flow():
        c = context['customer']
        after = api('POST', f"/api/customers/{q(c['id'])}/contacts", {'name': f'TEST联系人-{STAMP}', 'title': '采购经理', 'phone': '13800000000', 'email': f'test{STAMP}@example.com', 'messenger': 'WhatsApp', 'remark': '自动化测试联系人'})
        contacts = after.get('contacts', [])
        contact = next((x for x in contacts if x.get('name') == f'TEST联系人-{STAMP}'), None)
        assert contact, contacts
        after_delete = api('DELETE', f"/api/customers/{q(c['id'])}/contacts/{q(contact['id'])}")
        assert not any(x.get('id') == contact['id'] for x in after_delete.get('contacts', [])), after_delete
        return 'contact add/delete ok'
    try_case('CUST-011/013/016', '客户', '联系人新增、详情数据与删除', customer_contact_flow, 'P0')

    def customer_file_flow():
        c = context['customer']
        p = Path('/private/tmp') / f'kpm-customer-material-{STAMP}.txt'
        p.write_text(f'customer material {STAMP}\n', encoding='utf-8')
        uploaded = upload_file(p, 'customer-materials', c['id'])
        after_mat = api('POST', f"/api/customers/{q(c['id'])}/materials", uploaded)
        assert any(m.get('objectKey') == uploaded['objectKey'] for m in after_mat.get('materials', [])), after_mat.get('materials')
        p2 = Path('/private/tmp') / f'kpm-customer-followup-{STAMP}.txt'
        p2.write_text(f'customer followup {STAMP}\n', encoding='utf-8')
        attachment = upload_file(p2, 'customer-followup-attachments', c['id'])
        after_fu = api('POST', f"/api/customers/{q(c['id'])}/followups", {'author': 'Codex', 'content': '自动化跟进记录', 'attachments': [attachment]})
        assert any(f.get('content') == '自动化跟进记录' for f in after_fu.get('followups', [])), after_fu.get('followups')
        return f"material={uploaded['objectKey']}"
    try_case('FILE-007/008/CUST-017/020', '客户', '客户资料与跟进附件 OSS 上传落库', customer_file_flow, 'P0')

    # Project flow.
    def project_flow():
        project = api('POST', '/api/projects', {
            'externalName': f'TEST-AUTO项目-{STAMP}',
            'internalName': f'TA-IN-{STAMP}',
            'modelName': f'TA-MODEL-{STAMP}',
            'managerAccount': 'zhangmin',
            'description': '自动化测试项目',
            'members': [{'userAccount': 'wanggong', 'role': '硬件项目成员'}],
            'stages': [
                {'name': '自动阶段A', 'assignees': [{'type': 'user', 'account': 'zhangmin', 'name': '张敏'}]},
                {'name': '自动阶段B', 'assignees': [{'type': 'user', 'account': 'wanggong', 'name': '王工'}]},
            ]
        })
        cleanup.append(('project', project['id']))
        assert 'status' not in project, project
        members = project.get('members', [])
        assert any(m.get('userAccount') == 'zhangmin' for m in members), members
        context['project'] = project
        context['stage_a'] = project['stages'][0]
        context['stage_b'] = project['stages'][1]
        return f"project={project['id']} members={len(members)} stages={len(project['stages'])}"
    try_case('PROJ-005/006/008/014', '项目', '新建项目不返回总体状态、负责人自动入成员', project_flow, 'P0')

    def project_stage_status_flow():
        p = context['project']
        st_a = context['stage_a']['id']
        st_b = context['stage_b']['id']
        denied = api('PUT', f'/api/projects/stages/{q(st_a)}', {'status': '进行中'}, expect_success=False, headers={'X-KPM-Account': 'wanggong'})
        assert denied.get('success') is False, denied
        api('PUT', f'/api/projects/stages/{q(st_a)}', {'status': '进行中'}, headers={'X-KPM-Account': 'zhangmin'})
        p1 = api('GET', f"/api/projects/{q(p['id'])}")
        assert 'status' not in p1, p1
        assert next(s for s in p1['stages'] if s['id'] == st_a).get('status') == '进行中', p1['stages']
        api('PUT', f'/api/projects/stages/{q(st_a)}', {'status': '已完成'}, headers={'X-KPM-Account': 'zhangmin'})
        api('PUT', f'/api/projects/stages/{q(st_b)}', {'status': '已完成'}, headers={'X-KPM-Account': 'wanggong'})
        p2 = api('GET', f"/api/projects/{q(p['id'])}")
        assert next(s for s in p2['stages'] if s['id'] == st_a).get('status') == '已完成', p2['stages']
        assert next(s for s in p2['stages'] if s['id'] == st_b).get('status') == '已完成', p2['stages']
        context['project'] = p2
        return 'stage owner permission ok'
    try_case('PROJ-014/015/STAGE-002', '项目', '阶段状态仅负责人可修改且项目无总体状态', project_stage_status_flow, 'P0')

    def project_material_flow():
        p = context['project']
        stage_id = context['stage_a']['id']
        path = Path('/private/tmp') / f'kpm-stage-material-{STAMP}.txt'
        path.write_text(f'stage material {STAMP}\n', encoding='utf-8')
        uploaded = upload_file(path, 'project-stage-materials', f"{p['id']}-{stage_id}")
        after = api('POST', f'/api/projects/stages/{q(stage_id)}/materials', uploaded)
        stage = next(s for s in after['stages'] if s['id'] == stage_id)
        material = next((m for m in stage.get('materials', []) if m.get('objectKey') == uploaded['objectKey']), None)
        assert material, stage.get('materials')
        published = api('POST', f"/api/projects/stage-materials/{q(material['id'])}/publish")
        assert any(m.get('objectKey') == uploaded['objectKey'] for m in published.get('projectMaterials', [])), published.get('projectMaterials')
        return f"published={uploaded['objectKey']}"
    try_case('FILE-004/006/STAGE-007/010/011', '阶段', '阶段资料 OSS 上传并发布到项目资料区', project_material_flow, 'P0')

    def stage_record_flow():
        p = context['project']
        stage_id = context['stage_a']['id']
        path = Path('/private/tmp') / f'kpm-stage-record-{STAMP}.txt'
        path.write_text(f'stage record attachment {STAMP}\n', encoding='utf-8')
        uploaded = upload_file(path, 'stage-record-attachments', f"{p['id']}-{stage_id}")
        after = api('POST', f'/api/projects/stages/{q(stage_id)}/records', {'author': 'Codex', 'content': '自动化阶段留言', 'attachments': [uploaded]})
        stage = next(s for s in after['stages'] if s['id'] == stage_id)
        assert any(r.get('content') == '自动化阶段留言' for r in stage.get('records', [])), stage.get('records')
        return 'stage record with attachment ok'
    try_case('FILE-005/STAGE-004', '阶段', '阶段留言附件保存', stage_record_flow, 'P0')

    def project_customer_requirement_flow():
        p = context['project']
        c = context['customer']
        linked = api('POST', f"/api/projects/{q(p['id'])}/customers", {'customerId': c['id'], 'projectStatus': '商机发掘'})
        assert any(pc.get('customerId') == c['id'] for pc in linked.get('projectCustomers', [])), linked.get('projectCustomers')
        updated = api('PUT', f"/api/projects/{q(p['id'])}/customers/{q(c['id'])}", {'projectStatus': '样机测试'})
        pc = next(pc for pc in updated.get('projectCustomers', []) if pc.get('customerId') == c['id'])
        assert pc.get('projectStatus') == '样机测试', pc
        req = api('POST', f"/api/projects/{q(p['id'])}/customers/{q(c['id'])}/requirements", {
            'title': f'TEST-AUTO需求-{STAMP}',
            'userStory': '作为售前，希望记录客户特殊需求',
            'businessValue': '便于跨部门协作',
            'acceptance': '任务完成后需求自动已实现',
            'priority': '高',
            'proposer': '客户A',
            'creator': 'Codex',
            'expectedCompletionAt': '2026-06-20',
            'createTask': True,
        })
        context['requirement'] = req
        cleanup.append(('requirement', req['id']))
        assert req.get('taskId'), req
        cleanup.append(('task', req['taskId']))
        detail = api('GET', f"/api/tasks/{q(req['taskId'])}")
        assert detail.get('category') == '需求', detail
        overview = api('GET', f"/api/projects/{q(p['id'])}/requirements-overview")
        assert any(o.get('title') == req['title'] for o in overview), overview
        return f"req={req['id']} task={req['taskId']}"
    try_case('REQ-002/003/006/008/009/014', '需求', '项目客户关联、需求创建关联任务与纵览', project_customer_requirement_flow, 'P0')

    def requirement_task_sync_flow():
        req = context['requirement']
        task = api('GET', f"/api/tasks/{q(req['taskId'])}")
        body = dict(task)
        body.update({'status': '已完成', 'assignees': task.get('assignees', ['Codex']), 'participants': task.get('participants', [])})
        api('PUT', f"/api/tasks/{q(req['taskId'])}", body)
        updated_project = api('GET', f"/api/projects/{q(context['project']['id'])}")
        pc = next(pc for pc in updated_project['projectCustomers'] if pc['customerId'] == context['customer']['id'])
        requirement = next(r for r in pc['requirements'] if r['id'] == req['id'])
        assert requirement['status'] == '已实现', requirement
        # Rejected sync is checked with another requirement to avoid overwriting same result ambiguity.
        req2 = api('POST', f"/api/projects/{q(context['project']['id'])}/customers/{q(context['customer']['id'])}/requirements", {
            'title': f'TEST-AUTO拒绝需求-{STAMP}',
            'userStory': '作为客户，希望验证拒绝联动',
            'businessValue': '测试联动',
            'acceptance': '拒绝后需求已拒绝',
            'priority': '中',
            'proposer': '客户A',
            'creator': 'Codex',
            'expectedCompletionAt': '2026-06-21',
            'createTask': True,
        })
        cleanup.append(('requirement', req2['id']))
        cleanup.append(('task', req2['taskId']))
        t2 = api('GET', f"/api/tasks/{q(req2['taskId'])}")
        b2 = dict(t2)
        b2.update({'status': '已拒绝', 'assignees': t2.get('assignees', ['Codex']), 'participants': t2.get('participants', [])})
        api('PUT', f"/api/tasks/{q(req2['taskId'])}", b2)
        updated_project2 = api('GET', f"/api/projects/{q(context['project']['id'])}")
        pc2 = next(pc for pc in updated_project2['projectCustomers'] if pc['customerId'] == context['customer']['id'])
        requirement2 = next(r for r in pc2['requirements'] if r['id'] == req2['id'])
        assert requirement2['status'] == '已拒绝', requirement2
        voided = api('POST', f"/api/projects/requirements/{q(req2['id'])}/void")
        assert voided['status'] == '已作废', voided
        return 'implemented/rejected/void sync ok'
    try_case('REQ-010/011/012', '需求', '任务完成/拒绝联动需求状态与作废', requirement_task_sync_flow, 'P0')

    # Task flow.
    def task_flow():
        p = context['project']
        stage_id = context['stage_b']['id']
        t = api('POST', '/api/tasks', {
            'title': f'TEST-AUTO普通任务-{STAMP}',
            'description': '自动化任务描述',
            'projectId': p['id'],
            'stageId': stage_id,
            'customerId': context['customer']['id'],
            'category': 'Bug',
            'status': '待处理',
            'priority': '中',
            'creator': 'Codex',
            'expectedCompletionAt': '2026-06-22',
            'assignees': ['张敏', '王工'],
            'participants': ['李娜'],
            'source': '完整测试',
        })
        cleanup.append(('task', t['id']))
        assert t.get('creator') == 'Codex', t
        assert len(t.get('assignees', [])) == 2, t
        assert t.get('category') == 'Bug', t
        t_body = dict(t)
        t_body.update({'description': '自动化任务描述已修改', 'priority': '高', 'status': task_status, 'assignees': ['张敏'], 'participants': ['李娜', '王工'], 'expectedCompletionAt': '2026-06-23'})
        updated = api('PUT', f"/api/tasks/{q(t['id'])}", t_body)
        assert updated.get('status') == task_status and updated.get('priority') == '高', updated
        path = Path('/private/tmp') / f'kpm-task-comment-{STAMP}.txt'
        path.write_text(f'task comment attachment {STAMP}\n', encoding='utf-8')
        uploaded = upload_file(path, 'task-comment-attachments', t['id'])
        after_comment = api('POST', f"/api/tasks/{q(t['id'])}/comments", {'author': 'Codex', 'content': '自动化任务评论', 'attachments': [uploaded]})
        assert any(c.get('content') == '自动化任务评论' for c in after_comment.get('comments', [])), after_comment.get('comments')
        path2 = Path('/private/tmp') / f'kpm-task-attachment-{STAMP}.txt'
        path2.write_text(f'task attachment {STAMP}\n', encoding='utf-8')
        uploaded2 = upload_file(path2, 'task-attachments', t['id'])
        after_attachment = api('POST', f"/api/tasks/{q(t['id'])}/attachments", uploaded2)
        assert any(a.get('objectKey') == uploaded2['objectKey'] for a in after_attachment.get('attachments', [])), after_attachment.get('attachments')
        context['task'] = after_attachment
        return f"task={t['id']} status={task_status}"
    try_case('TASK-003/004/006/007/008/010/011/014/017', '任务', '任务新增修改、可配置状态、多人执行者/参与者、附件与评论', task_flow, 'P0')

    # Order flow.
    def order_flow():
        p = context['project']
        c = context['customer']
        order = api('POST', '/api/orders', {
            'orderDate': '2026-06-01',
            'customerId': c['id'],
            'projectId': p['id'],
            'quantity': 12,
            'specification': 'TEST 4G / NFC / Printer',
            'expectedShipDate': '2026-07-01',
            'plannedShipDate': '2026-07-05',
            'softwareVersion': 'v1.0.0-test',
            'creator': 'Codex',
            'orderType': '正式订单',
            'currency': 'USD',
            'unitPrice': '199.50',
        })
        cleanup.append(('order', order['id']))
        assert float(order.get('amount')) == 2394.0, order
        p_detail = api('GET', f"/api/projects/{q(p['id'])}")
        pc = next(pc for pc in p_detail.get('projectCustomers', []) if pc.get('customerId') == c['id'])
        assert pc.get('projectStatus') == '订单冲刺', pc
        updated = api('PUT', f"/api/orders/{q(order['id'])}", {
            'orderDate': '2026-06-01',
            'customerId': c['id'],
            'projectId': p['id'],
            'quantity': 15,
            'specification': 'TEST 4G / NFC / Printer / Updated',
            'expectedShipDate': '2026-07-01',
            'plannedShipDate': '2026-07-10',
            'softwareVersion': 'v1.0.1-test',
            'creator': 'Codex',
            'modifier': 'Codex',
            'orderType': '正式订单',
            'currency': 'USD',
            'unitPrice': '199.50',
            'changeReason': '自动化测试修改原因',
            'changeSummary': '自动化测试修改数量和计划发货日期',
        })
        assert float(updated.get('amount')) == 2992.5, updated
        assert any((h.get('changeReason') or h.get('reason')) == '自动化测试修改原因' for h in updated.get('histories', [])), updated.get('histories')
        return f"order={order['id']} amount={updated.get('amount')} histories={len(updated.get('histories', []))}"
    try_case('ORDER-003/007/008/010/013/014/015/016/017', '订单', '订单新增、金额计算、修改记录与客户项目状态联动', order_flow, 'P0')

    def order_type_link_flow():
        # Dedicated customer/project pair, verifying sample/pre-order status mapping without polluting main pair.
        c2 = api('POST', '/api/customers', {
            'name': f'TEST-AUTO订单客户-{STAMP}',
            'shortName': f'TA-ORD-CUST-{STAMP}',
            'region': 'Order Region',
            'level': 'C / 普通客户',
            'status': '潜在客户',
            'salesOwners': ['张敏'],
            'supportOwners': ['王工'],
        })
        cleanup.append(('customer', c2['id']))
        p2 = api('POST', '/api/projects', {
            'externalName': f'TEST-AUTO订单项目-{STAMP}',
            'internalName': f'TA-ORD-IN-{STAMP}',
            'modelName': f'TA-ORD-MODEL-{STAMP}',
            'managerAccount': 'zhangmin',
            'description': '订单状态联动项目',
            'members': [],
            'stages': [{'name': '订单阶段', 'assignees': []}],
        })
        cleanup.append(('project', p2['id']))
        o1 = api('POST', '/api/orders', {'orderDate': '2026-06-01', 'customerId': c2['id'], 'projectId': p2['id'], 'quantity': 1, 'specification': 'Sample', 'expectedShipDate': '2026-06-10', 'plannedShipDate': '2026-06-11', 'softwareVersion': 'v-sample', 'creator': 'Codex', 'orderType': '样品订单', 'currency': 'USD', 'unitPrice': '1'})
        cleanup.append(('order', o1['id']))
        pd1 = api('GET', f"/api/projects/{q(p2['id'])}")
        pc1 = next(pc for pc in pd1['projectCustomers'] if pc['customerId'] == c2['id'])
        assert pc1['projectStatus'] == '样机测试', pc1
        o2 = api('POST', '/api/orders', {'orderDate': '2026-06-02', 'customerId': c2['id'], 'projectId': p2['id'], 'quantity': 1, 'specification': 'Pre', 'expectedShipDate': '2026-06-10', 'plannedShipDate': '2026-06-11', 'softwareVersion': 'v-pre', 'creator': 'Codex', 'orderType': '预订单', 'currency': 'USD', 'unitPrice': '1'})
        cleanup.append(('order', o2['id']))
        pd2 = api('GET', f"/api/projects/{q(p2['id'])}")
        pc2 = next(pc for pc in pd2['projectCustomers'] if pc['customerId'] == c2['id'])
        assert pc2['projectStatus'] == '商机发掘', pc2
        return 'sample/pre-order mapping ok'
    try_case('ORDER-011/012', '订单', '样品订单/预订单客户项目状态映射', order_type_link_flow, 'P1')

    # Template CRUD.
    def template_flow():
        tpl = api('POST', '/api/projects/templates', {'name': f'TEST-AUTO模板-{STAMP}', 'scope': '测试', 'status': '启用', 'stages': ['T1', 'T2']})
        cleanup.append(('template', tpl['id']))
        assert tpl.get('stages') == ['T1', 'T2'], tpl
        upd = api('PUT', f"/api/projects/templates/{q(tpl['id'])}", {'name': f'TEST-AUTO模板改-{STAMP}', 'scope': '测试', 'status': '启用', 'stages': ['T1', 'T2', 'T3']})
        assert upd.get('stages') == ['T1', 'T2', 'T3'], upd
        return f"template={tpl['id']} stages={len(upd.get('stages', []))}"
    try_case('PROJ-TPL-001', '流程模板', '流程模板 CRUD', template_flow, 'P1')

    # Analytics.
    try_case('ANA-001/005/006', '统计看板', '订单统计 USD', lambda: f"rows={len(api('GET', '/api/analytics/orders?targetCurrency=USD'))}", 'P1')
    try_case('ANA-007', '统计看板', '订单统计 CNY', lambda: f"rows={len(api('GET', '/api/analytics/orders?targetCurrency=CNY'))}", 'P1')
    try_case('ANA-008/009', '统计看板', '资源分配统计数据', lambda: f"rows={len(api('GET', '/api/analytics/resource-map'))}", 'P1')
    try_case('ANA-010/011/012', '统计看板', '技术支持统计数据', lambda: f"rows={len(api('GET', '/api/analytics/support'))}", 'P1')
    try_case('ANA-013/014', '统计看板', '客户活跃度统计数据', lambda: f"rows={len(api('GET', '/api/analytics/activity'))}", 'P1')

    # Frontend static and interaction-adjacent checks.
    app_js = APP_JS.read_text(encoding='utf-8')
    static_checks = [
        ('NAV-001', '前端', '主要菜单关键字存在', ['项目管理', '客户管理', '任务管理', '订单管理', '统计看板', '资源管理']),
        ('UX-001', '前端', '必填校验逻辑存在', ['validate', '必填', 'showValidationToast']),
        ('UX-002', '前端', '二次确认逻辑存在', ['confirmationDialog', 'confirm-dialog', '确认提交']),
        ('FILE-011', '前端', '文件下载逻辑存在', ['download-file', 'downloadUrl', 'openFileDownload']),
        ('TASK-011', '前端', '任务状态使用资源配置逻辑存在', ['taskStatusTransitions', '所有启用状态都可以在这里使用']),
        ('CUST-013/014', '前端', '客户联系人详情/折叠展示逻辑存在', ['contact', '联系人', '查看全部联系人']),
        ('STAGE-010', '前端', '阶段资料发布确认入口存在', ['request-stage-file-publish', '发布到项目资料区']),
    ]
    for case_id, module, title, keywords in static_checks:
        try_case(case_id, module, title, lambda kws=keywords: 'keywords ok' if all(k in app_js for k in kws) else (_ for _ in ()).throw(AssertionError([k for k in kws if k not in app_js])), 'P1')

    # Explicit manual/browser-only cases.
    browser_limited = [
        ('LOGIN-004', '登录动效', '需要真实浏览器观察四个小人/捂眼睛动效'),
        ('NAV-003', '页面状态', '需要浏览器多页面来回点击观察'),
        ('I18N-001/002', '国际化', '需要浏览器切换语言并观察布局'),
        ('PROJ-009/010', '输入搜索', '需要浏览器验证人员选择器输入搜索交互'),
        ('PROJ-017/018/019/021/022', '项目弹窗与二次确认', '需要浏览器点击弹窗与确认'),
        ('STAGE-003/005/006/008/009/012/013/014/015', '阶段详情 UI', '需要浏览器验证留言折叠、弹窗、新建任务和卡点求助'),
        ('CUST-018/019/022/023/024/025', '客户详情 UI', '需要浏览器验证折叠、查看全部、客户下单入口'),
        ('ORDER-005/006/018/019', '订单 UI', '需要浏览器验证输入搜索、删除二次确认、客户详情下单入口'),
        ('RES-020', '资源表单二次确认', '需要浏览器验证弹窗确认'),
        ('UI-001~007', '视觉布局', '需要浏览器截图/人工观察'),
    ]
    for case_id, module, title in browser_limited:
        skip_case(case_id, module, title, 'Browser 插件当前无可用 in-app browser pane；本机 Playwright 未安装且 npm registry 当前不可达。', 'P2')

    # DB/data persistence spot checks after creates/updates.
    try_case('API-002/003/004/005/006', '联调', '新增修改数据刷新后仍能从后端读取', lambda: 'backend persisted test data ok' if api('GET', f"/api/projects/{q(context['project']['id'])}").get('id') == context['project']['id'] else (_ for _ in ()).throw(AssertionError('project missing')), 'P0')


def check_openapi():
    ports = [8101, 8102, 8103, 8104, 8105, 8106, 8107, 8108]
    counts = []
    for port in ports:
        with urllib.request.urlopen(f'http://127.0.0.1:{port}/v3/api-docs', timeout=8) as resp:
            doc = json.loads(resp.read().decode('utf-8'))
        if not doc.get('openapi') or not doc.get('paths'):
            raise AssertionError(f'bad openapi on {port}')
        counts.append(f'{port}:{len(doc.get("paths", {}))}')
    return ', '.join(counts)

def write_report():
    total = len(results)
    passed = sum(1 for r in results if r['status'] == 'PASS')
    failed = sum(1 for r in results if r['status'] == 'FAIL')
    skipped = sum(1 for r in results if r['status'] == 'SKIP')
    p0_failed = [r for r in results if r['priority'] == 'P0' and r['status'] == 'FAIL']
    status = '通过' if failed == 0 else '不通过'
    lines = []
    lines.append('# KPM V1 完整功能测试执行报告')
    lines.append('')
    lines.append(f'> 执行时间：{now()}')
    lines.append(f'> 环境：`/Users/henry/Documents/KPM`')
    lines.append(f'> 前端：`{FRONTEND}`')
    lines.append(f'> 网关：`{BASE}`')
    lines.append(f'> 结论：**自动化可执行范围 {status}**；总计 {total}，Pass {passed}，Fail {failed}，Skip {skipped}。')
    lines.append('')
    lines.append('## 1. 总览')
    lines.append('')
    lines.append('| 指标 | 数量 |')
    lines.append('|---|---:|')
    lines.append(f'| Total | {total} |')
    lines.append(f'| Pass | {passed} |')
    lines.append(f'| Fail | {failed} |')
    lines.append(f'| Skip / 需人工复测 | {skipped} |')
    lines.append(f'| P0 Fail | {len(p0_failed)} |')
    lines.append('')
    lines.append('## 2. 失败项')
    lines.append('')
    failures = [r for r in results if r['status'] == 'FAIL']
    if not failures:
        lines.append('无自动化失败项。')
    else:
        lines.append('| 用例 | 模块 | 优先级 | 标题 | 错误 |')
        lines.append('|---|---|---|---|---|')
        for r in failures:
            lines.append(f"| {r['caseId']} | {r['module']} | {r['priority']} | {r['title']} | {r['detail'].replace('|','/')} |")
    lines.append('')
    lines.append('## 3. 需浏览器/人工复测项')
    lines.append('')
    skips = [r for r in results if r['status'] == 'SKIP']
    if not skips:
        lines.append('无。')
    else:
        lines.append('| 用例 | 模块 | 标题 | 原因 |')
        lines.append('|---|---|---|---|')
        for r in skips:
            lines.append(f"| {r['caseId']} | {r['module']} | {r['title']} | {r['detail'].replace('|','/')} |")
    lines.append('')
    lines.append('## 4. 明细')
    lines.append('')
    lines.append('| 用例 | 模块 | 优先级 | 状态 | 标题 | 说明 |')
    lines.append('|---|---|---|---|---|---|')
    for r in results:
        detail = r['detail'].replace('\n', ' ').replace('|', '/')
        lines.append(f"| {r['caseId']} | {r['module']} | {r['priority']} | {r['status']} | {r['title']} | {detail} |")
    lines.append('')
    lines.append('## 5. 说明')
    lines.append('')
    lines.append('- 自动化测试已创建并清理 `TEST-AUTO` 前缀的客户、项目、任务、订单、资源配置等数据。')
    lines.append('- OSS 测试文件是真实写入，不在脚本中删除；建议按 `KPM/*/TEST-AUTO` 或测试时间目录定期清理。')
    lines.append('- Browser 插件当前无法取得 in-app browser pane；Playwright 未安装且 npm registry 不可达，因此纯视觉和浏览器交互项列为需人工复测。')
    REPORT_PATH.write_text('\n'.join(lines), encoding='utf-8')
    JSON_PATH.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'\nREPORT {REPORT_PATH}')
    print(f'JSON   {JSON_PATH}')

if __name__ == '__main__':
    try:
        run()
    finally:
        cleanup_api()
        write_report()
    failed = [r for r in results if r['status'] == 'FAIL']
    sys.exit(1 if failed else 0)
