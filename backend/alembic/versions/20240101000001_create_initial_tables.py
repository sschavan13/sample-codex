"""create initial tables"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20240101000001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "user",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=True),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
    )
    op.create_index("ix_user_email", "user", ["email"], unique=True)

    op.create_table(
        "tag",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("name", sa.String(length=50), nullable=False),
    )
    op.create_index("ix_tag_name", "tag", ["name"], unique=True)

    op.create_table(
        "link",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("url", sa.String(length=1024), nullable=False),
        sa.Column("normalized_url", sa.String(length=1024), nullable=False),
        sa.Column("title", sa.String(length=512), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("image_url", sa.String(length=1024), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_link_url", "link", ["url"], unique=False)
    op.create_index("ix_link_normalized_url", "link", ["normalized_url"], unique=True)

    op.create_table(
        "linktag",
        sa.Column("link_id", sa.Integer(), nullable=False),
        sa.Column("tag_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["link_id"], ["link.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["tag_id"], ["tag.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("link_id", "tag_id"),
    )

    op.execute(
        "CREATE VIRTUAL TABLE IF NOT EXISTS link_fts USING fts5(title, description, url)"
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS link_fts")
    op.drop_table("linktag")
    op.drop_index("ix_link_normalized_url", table_name="link")
    op.drop_index("ix_link_url", table_name="link")
    op.drop_table("link")
    op.drop_index("ix_tag_name", table_name="tag")
    op.drop_table("tag")
    op.drop_index("ix_user_email", table_name="user")
    op.drop_table("user")
