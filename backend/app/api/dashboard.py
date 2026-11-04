from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Annotated, Literal
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.config import settings
from app.models.database import get_db
from app.models.screening_record import ScreeningRecord
from app.schemas.screening_schema import serialize_record

router = APIRouter(prefix='/api', tags=['dashboard'])


@router.get('/dashboard')
def dashboard(days: Annotated[int, Query(ge=7, le=30)] = 30, db: Session = Depends(get_db)):
    records = db.scalars(select(ScreeningRecord).where(ScreeningRecord.is_saved.is_(True)).order_by(ScreeningRecord.screening_timestamp.desc(), ScreeningRecord.id.desc())).all()
    today = datetime.now(timezone.utc).date()
    by_date = Counter(record.screening_timestamp.date() for record in records)
    by_grade = Counter(record.predicted_grade for record in records)
    measured = [record.analysis_ms for record in records if record.analysis_ms > 0]
    return {
        'total': len(records),
        'this_week': sum(record.screening_timestamp.date() >= today - timedelta(days=6) for record in records),
        'quality_pass_rate': round(100 * sum(record.quality_status == 'ACCEPTABLE' for record in records) / len(records)) if records else 0,
        'average_analysis_ms': round(sum(measured) / len(measured), 2) if measured else 0,
        'previous_period': sum(today - timedelta(days=days * 2 - 1) <= record.screening_timestamp.date() <= today - timedelta(days=days) for record in records),
        'distribution': [{'grade': grade, 'count': by_grade[grade]} for grade in range(5)],
        'activity': [{'date': (today - timedelta(days=offset)).isoformat(), 'count': by_date[today - timedelta(days=offset)]} for offset in reversed(range(days))],
        'recent': [serialize_record(record).model_dump(mode='json') for record in records[:5]],
        'model_type': settings.model_type,
    }
