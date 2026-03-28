"""initial tables

Revision ID: 75e5a97dbd9b
Revises: 18b2254265f5
Create Date: 2026-03-28 15:30:54.321631

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '75e5a97dbd9b'
down_revision: Union[str, None] = '18b2254265f5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('email', sa.String(length=255), nullable=True), schema='abc')

def downgrade() -> None:
    op.drop_column('users', 'email', schema='abc')