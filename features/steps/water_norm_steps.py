from behave import given, when, then
from fastapi.testclient import TestClient
import main

client = TestClient(main.app)


@given('the service is available')
def step_service_available(context):
    response = client.get("/api/status")
    context.api_response = response
    assert response.status_code == 200, f"Service not available: {response.status_code}"


@when('I send POST request to "{endpoint}" with body:')
def step_send_post_request(context, endpoint):
    data = {}
    for row in context.table:
        field = row['field']
        value = row['value']

        if field == 'weight' and value:
            try:
                value = float(value)
            except ValueError:
                pass
        data[field] = value if value else None

    response = client.post(endpoint, json=data)
    context.api_response = response


@then('response status is {status_code:d}')
def step_check_status(context, status_code):
    assert context.api_response.status_code == status_code, \
        f"Expected {status_code}, got {context.api_response.status_code}. Body: {context.api_response.text}"


@then('response success is {expected_value}')
def step_check_success(context, expected_value):
    expected_bool = expected_value.lower() == 'true'
    data = context.api_response.json()
    assert data.get("success") == expected_bool, \
        f"Expected success={expected_bool}, got {data.get('success')}"


@then('recommended_norm_liters is {expected_norm:g}')
def step_check_norm(context, expected_norm):
    data = context.api_response.json()
    assert data.get("success") == True, f"Request failed: {data.get('error')}"

    actual_norm = data.get("data", {}).get("recommended_norm_liters")
    assert actual_norm == expected_norm, \
        f"Expected norm {expected_norm}L, got {actual_norm}L"


@then('error contains "{expected_text}"')
def step_error_contains(context, expected_text):
    data = context.api_response.json()
    error_msg = data.get("error", "")
    assert expected_text.lower() in error_msg.lower(), \
        f"Expected '{expected_text}' in error message, got '{error_msg}'"