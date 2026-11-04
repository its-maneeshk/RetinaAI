from datetime import date
from typing import Annotated, Literal
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.config import settings
from app.models.database import get_db
from app.models.screening_record import ScreeningRecord
from app.schemas.screening_schema import CaseMetadata, PredictionResponse, SaveRequest, serialize_record
from app.services.prediction_service import analyze

router = APIRouter(prefix='/api/screening', tags=['screening'])


@router.post('/analyze', response_model=PredictionResponse)
def analyze_screening(
    image: Annotated[UploadFile, File()],
    case_id: Annotated[str, Form(max_length=50)],
    patient_reference: Annotated[str, Form(max_length=36)],
    screening_date: Annotated[date, Form()],
    age: Annotated[int | None, Form(ge=0, le=120)] = None,
    eye: Annotated[Literal['LEFT', 'RIGHT', 'UNSPECIFIED'], Form()] = 'UNSPECIFIED',
    db: Session = Depends(get_db),
):
    try:
        metadata = CaseMetadata(case_id=case_id, patient_reference=patient_reference, screening_date=screening_date, age=age, eye=eye)
    except ValidationError:
        raise HTTPException(422, 'Use a generated CASE- identifier and a synthetic reference starting with SYN-. Check the date and age.') from None
    try:
        data = image.file.read(settings.max_image_bytes + 1)
        record = analyze(data, image.filename or '', image.content_type, metadata, db)
        return serialize_record(record)
    finally:
        image.file.close()


@router.post('/save', response_model=PredictionResponse)
def save_screening(payload: SaveRequest, db: Session = Depends(get_db)):
    record = db.scalar(select(ScreeningRecord).where(ScreeningRecord.record_id == payload.record_id))
    if record is None:
        raise HTTPException(404, 'The analysis draft was not found.')
    record.is_saved = True
    db.commit()
    return serialize_record(record)
