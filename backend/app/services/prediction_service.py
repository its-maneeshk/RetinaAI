from datetime import datetime, timezone
from time import perf_counter
import uuid
import numpy as np
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.config import settings
from app.ml.model_loader import model_loader
from app.ml.preprocessing import preprocess
from app.models.screening_record import ScreeningRecord
from app.schemas.screening_schema import CaseMetadata, GRADE_LABELS
from app.services.image_service import decode_image, save_private_image, remove_private_image
from app.services.quality_service import check_quality


def analyze(data: bytes, filename: str, content_type: str | None, metadata: CaseMetadata, db: Session) -> ScreeningRecord:
    start = perf_counter()
    if model_loader.model is None:
        raise HTTPException(503, 'The model is unavailable. Review system information or try again later.')
    image = decode_image(data, filename, content_type)
    try:
        quality_status, messages = check_quality(image)
        try:
            scores = model_loader.predict(preprocess(image))
        except (RuntimeError, ValueError):
            raise HTTPException(503, 'The model could not complete inference safely. No result was generated.') from None
        grade = int(np.argmax(scores))
        now = datetime.now(timezone.utc)
        image_filename = save_private_image(image)
        record = ScreeningRecord(
            record_id=f'DR-{now.year}-{uuid.uuid4().hex[:10].upper()}',
            **metadata.model_dump(), image_filename=image_filename,
            predicted_grade=grade, predicted_label=GRADE_LABELS[grade],
            model_score=float(scores[grade]), model_version=settings.model_version,
            model_type=settings.model_type, quality_status=quality_status, quality_messages=messages,
            screening_timestamp=now.replace(tzinfo=None), is_saved=False,
            probabilities=[float(score) for score in scores], image_width=image.width,
            image_height=image.height, analysis_ms=round((perf_counter() - start) * 1000, 2),
        )
        try:
            db.add(record)
            db.commit()
            db.refresh(record)
        except Exception:
            db.rollback()
            remove_private_image(image_filename)
            raise
        return record
    finally:
        image.close()
