from datetime import datetime, timedelta, timezone
from sqlalchemy import func, select
from app.config import settings
from app.models.database import SessionLocal
from app.models.screening_record import ScreeningRecord
from app.schemas.screening_schema import GRADE_LABELS


def seed_demo_records() -> None:
    if not settings.seed_demo or settings.model_type != 'DEMO':
        return
    with SessionLocal() as db:
        if db.scalar(select(func.count()).select_from(ScreeningRecord)):
            return
        today = datetime.now(timezone.utc).replace(microsecond=0, tzinfo=None) - timedelta(minutes=1)
        grades = [0, 0, 2, 1, 0, 3, 0, 2, 1, 0, 4, 2]
        for index in range(48):
            grade = grades[index % len(grades)]
            score = 0.71 + (index % 8) * 0.027
            probabilities = [(1 - score) / 4] * 5
            probabilities[grade] = score
            timestamp = today - timedelta(days=(index * 7 // 12), minutes=(index * 47 % 360))
            quality = 'WARNING' if index % 11 == 6 else 'ACCEPTABLE'
            db.add(ScreeningRecord(
                record_id=f'DR-{today.year}-{48-index:04d}', case_id=f'CASE-EXAMPLE-{48-index:04d}',
                patient_reference=f'SYN-{1048-index}', age=None, eye='LEFT' if index % 2 else 'RIGHT',
                screening_date=timestamp.date(), image_filename=None,
                predicted_grade=grade, predicted_label=GRADE_LABELS[grade], model_score=score,
                quality_status=quality, quality_messages=['Preloaded synthetic example record; no image was analyzed. Technical quality status is illustrative.'],
                model_version='dummy-v1-fixture', model_type='DEMO', screening_timestamp=timestamp,
                is_saved=True, probabilities=probabilities, image_width=0, image_height=0, analysis_ms=0,
            ))
        db.commit()
