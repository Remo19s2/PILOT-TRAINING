import os
import re
from pathlib import Path

import pytest
from sqlalchemy import create_engine, inspect, text


MIGRATION_PATH = Path(__file__).parents[1] / "migrations" / "003_production_schema_reconciliation.sql"


def test_reconciliation_migration_has_only_known_fk_dependencies():
    migration = MIGRATION_PATH.read_text(encoding="ascii")
    assert "REFERENCES planning_requirements" not in migration
    assert "ON CONFLICT (role_name)" not in migration
    assert "users(id)" not in migration
    assert "suppliers(id)" not in migration
    assert "components(id)" not in migration
    assert "roles(id)" not in migration
    assert re.search(r"requirement_id\s+uuid\s*,", migration)

    references = set(re.findall(r"REFERENCES\s+([a-z_]+)\s*\(\s*([a-z_]+)\s*\)", migration, re.IGNORECASE))
    assert ("users", "user_id") in references
    assert ("suppliers", "supplier_id") in references
    assert ("components", "component_id") in references
    assert ("workflow_executions", "id") in references
    assert ("rfqs", "id") in references
    assert ("quotations", "id") in references
    assert ("negotiations", "id") in references
    assert ("planning_requirements", "id") not in references


@pytest.mark.skipif(
    not os.getenv("DATABASE_URL") or "postgres" not in os.getenv("DATABASE_URL", "").lower(),
    reason="requires a PostgreSQL DATABASE_URL for integration validation",
)
def test_postgres_schema_contract_matches_orm():
    database_url = os.environ["DATABASE_URL"]
    engine = create_engine(database_url, future=True)
    inspector = inspect(engine)

    tables = set(inspector.get_table_names())
    required_tables = {
        "users",
        "roles",
        "suppliers",
        "components",
        "vehicle_models",
        "rfqs",
        "rfq_items",
        "rfq_suppliers",
        "quotations",
        "approvals",
        "negotiations",
        "purchase_orders",
        "purchase_order_items",
        "procurement_events",
        "workflow_executions",
        "decision_recommendations",
        "negotiation_messages",
        "audit_logs",
    }
    missing = sorted(required_tables - tables)
    assert not missing, f"Missing required PostgreSQL tables: {missing}"

    users_columns = {column["name"] for column in inspector.get_columns("users")}
    roles_columns = {column["name"] for column in inspector.get_columns("roles")}
    audit_columns = {column["name"] for column in inspector.get_columns("audit_logs")}

    assert "user_id" in users_columns, "users.user_id is required for the production ORM contract"
    assert "username" in users_columns, "users.username is required for login compatibility"
    assert "role_id" in roles_columns, "roles.role_id is required for the production ORM contract"
    assert "role_name" in roles_columns, "roles.role_name is required for the production ORM contract"
    assert "execution_id" in audit_columns, "audit_logs.execution_id is required by the ORM"

    role_name_is_unique = any(
        "role_name" in constraint.get("column_names", [])
        for constraint in inspector.get_unique_constraints("roles")
    ) or any(
        index.get("unique") and "role_name" in index.get("column_names", [])
        for index in inspector.get_indexes("roles")
    )
    migration = MIGRATION_PATH.read_text(encoding="ascii")
    if not role_name_is_unique:
        assert "ON CONFLICT (role_name)" not in migration

    required_uuid_columns = {
        "users": {"user_id"},
        "roles": {"role_id"},
        "suppliers": {"supplier_id"},
        "components": {"component_id"},
        "vehicle_models": {"vehicle_model_id"},
    }
    for table_name, column_names in required_uuid_columns.items():
        if table_name not in tables:
            continue
        columns = {column["name"]: column for column in inspector.get_columns(table_name)}
        for column_name in column_names:
            assert column_name in columns, f"Missing production UUID column: {table_name}.{column_name}"
            assert "UUID" in str(columns[column_name]["type"]).upper(), f"{table_name}.{column_name} must be UUID"

    for table_name in {"rfqs", "rfq_items", "rfq_suppliers", "quotations", "approvals", "negotiations", "purchase_orders", "purchase_order_items", "procurement_events", "workflow_executions", "decision_recommendations", "negotiation_messages", "audit_logs"}:
        if table_name not in tables:
            continue
        for foreign_key in inspector.get_foreign_keys(table_name):
            referred_table = foreign_key["referred_table"]
            referred_columns = foreign_key["referred_columns"]
            assert referred_table in tables, f"{table_name} references missing table {referred_table}"
            referred_schema = {column["name"]: column for column in inspector.get_columns(referred_table)}
            for referred_column in referred_columns:
                assert referred_column in referred_schema, f"{table_name} references missing column {referred_table}.{referred_column}"
                assert "UUID" in str(referred_schema[referred_column]["type"]).upper(), f"{referred_table}.{referred_column} must be UUID"

    required_indexes = {
        "workflow_executions": {"ix_execution_lineage", "ix_rfq_execution_status"},
        "procurement_events": {"ix_event_type_created"},
    }
    for table_name, index_names in required_indexes.items():
        actual_indexes = {index["name"] for index in inspector.get_indexes(table_name)}
        assert index_names <= actual_indexes, f"Missing required indexes on {table_name}: {index_names - actual_indexes}"

    unique_constraints = {
        "rfq_suppliers": {"rfq_id", "supplier_id"},
        "quotations": {"rfq_id", "supplier_id", "version"},
    }
    for table_name, required_columns in unique_constraints.items():
        actual_unique_sets = {
            frozenset(constraint.get("column_names", []))
            for constraint in inspector.get_unique_constraints(table_name)
        }
        actual_unique_sets.update(
            frozenset(index.get("column_names", []))
            for index in inspector.get_indexes(table_name)
            if index.get("unique")
        )
        assert frozenset(required_columns) in actual_unique_sets, f"Missing unique constraint on {table_name}: {required_columns}"

    fk_map = {
        fk["constrained_columns"][0]: fk["referred_table"]
        for fk in inspector.get_foreign_keys("audit_logs")
        if fk["constrained_columns"]
    }
    assert fk_map.get("execution_id") == "workflow_executions", "audit_logs.execution_id must point to workflow_executions.id"

    with engine.connect() as connection:
        user_row = connection.execute(
            text("SELECT user_id, username FROM users WHERE username = :username LIMIT 1"),
            {"username": "procurement"},
        ).first()
        assert user_row is not None, "The procurement login user should exist in the production schema"

        role_row = connection.execute(
            text("SELECT role_id, role_name FROM roles WHERE role_name = :role_name LIMIT 1"),
            {"role_name": "PROCUREMENT_MANAGER"},
        ).first()
        assert role_row is not None, "PROCUREMENT_MANAGER should exist in the production role table"

        assert connection.execute(text("SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'username' LIMIT 1")).scalar() == 1

        login_query = connection.execute(
            text(
                "SELECT u.user_id, u.username, u.password_hash "
                "FROM users u "
                "JOIN roles r ON r.role_id = u.role_id "
                "WHERE u.username = :username "
                "LIMIT 1"
            ),
            {"username": "procurement"},
        ).first()
        assert login_query is not None, "Login lookup should query the real production schema successfully"
