"""initial tables

Revision ID: 18b2254265f5
Revises: 3051192610af
Create Date: 2026-03-28 15:28:05.175978

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '18b2254265f5'
down_revision: Union[str, None] = '3051192610af'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('email', sa.String(length=255), nullable=True), schema='abc')
    op.add_column('users', sa.Column('username', sa.String(length=100), nullable=True), schema='abc')
    op.add_column('users', sa.Column('password_hash', sa.String(length=255), nullable=True), schema='abc')
    op.create_unique_constraint('uq_users_email', 'users', ['email'], schema='abc')
    op.create_unique_constraint('uq_users_username', 'users', ['username'], schema='abc')

def downgrade() -> None:
    op.drop_constraint('uq_users_email', 'users', schema='abc', type_='unique')
    op.drop_constraint('uq_users_username', 'users', schema='abc', type_='unique')
    op.drop_column('users', 'email', schema='abc')
    op.drop_column('users', 'username', schema='abc')
    op.drop_column('users', 'password_hash', schema='abc')