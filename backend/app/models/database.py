from pathlib import Path
from sqlalchemy import create_engine, event
from sqlalchemy.engine import make_url
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from app.config import settings


class Base(DeclarativeBase):
    pass


url = make_url(settings.database_url)
if url.drivername != 'sqlite':
    raise ValueError('This prototype expects a SQLite DATABASE_URL.')
if url.database and url.database != ':memory:':
    Path(url.database).parent.mkdir(parents=True, exist_ok=True)
engine = create_engine(settings.database_url, connect_args={'check_same_thread': False, 'timeout': 30})


@event.listens_for(engine, 'connect')
def configure_sqlite(connection, _record):
    connection.execute('PRAGMA journal_mode=WAL')
    connection.execute('PRAGMA foreign_keys=ON')


SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def get_db():
    with SessionLocal() as session:
        yield session
