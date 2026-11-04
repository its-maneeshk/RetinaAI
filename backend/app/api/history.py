import secrets
from typing import Annotated, Literal
from fastapi import APIRouter, Depends, Header, HTTPException, Query, Response
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session
from app.config import settings
from app.models.database import get_db
from app.models.screening_record import ScreeningRecord
from app.schemas.screening_schema import HistoryResponse, PredictionResponse, serialize_record
from app.services.image_service import remove_private_image

router = APIRouter(prefix='/api/screening', tags=['history'])


@router.get('/history', response_model=HistoryResponse)
def screening_history(
    search: Annotated[str, Query(max_length=64)] = '',
    grade: Annotated[int | None, Query(ge=0, le=4)] = None,
    quality: Literal['ACCEPTABLE', 'WARNING', 'REJECTED'] | None = None,
    page: Annotated[int, Query(ge=1, le=100000)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 10,
    sort: Literal['newest', 'oldest'] = 'newest',
    db: Session = Depends(get_db),
):
    query = select(ScreeningRecord).where(ScreeningRecord.is_saved.is_(True))
    if search.strip():
        query = query.where(or_(ScreeningRecord.record_id.contains(search.strip(), autoescape=True), ScreeningRecord.patient_reference.contains(search.strip(), autoescape=True), ScreeningRecord.case_id.contains(search.strip(), autoescape=True)))
    if grade is not None:
        query = query.where(ScreeningRecord.predicted_grade == grade)
    if quality is not None:
        query = query.where(ScreeningRecord.quality_status == quality)
    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    order = ScreeningRecord.screening_timestamp.desc() if sort == 'newest' else ScreeningRecord.screening_timestamp.asc()
    records = db.scalars(query.order_by(order, ScreeningRecord.id.desc()).offset((page - 1) * page_size).limit(page_size)).all()
    return HistoryResponse(records=[serialize_record(record) for record in records], total=total, page=page, page_size=page_size)


@router.get('/{record_id}', response_model=PredictionResponse)
def screening_details(record_id: str, db: Session = Depends(get_db)):
    record = db.scalar(select(ScreeningRecord).where(ScreeningRecord.record_id == record_id))
    if record is None:
        raise HTTPException(404, 'This screening record was not found.')
    return serialize_record(record)


@router.delete('/{record_id}', status_code=204)
def delete_screening(record_id: str, x_admin_key: Annotated[str | None, Header()] = None, db: Session = Depends(get_db)):
    if not settings.admin_api_key:
        raise HTTPException(403, 'Permanent deletion is disabled until the operator configures an administrator key.')
    if not x_admin_key or not secrets.compare_digest(x_admin_key, settings.admin_api_key):
        raise HTTPException(403, 'Administrator authorization is required to delete a screening.')
    record = db.scalar(select(ScreeningRecord).where(ScreeningRecord.record_id == record_id))
    if record is None:
        raise HTTPException(404, 'This screening record was not found.')
    filename = record.image_filename
    db.delete(record)
    db.commit()
    remove_private_image(filename)
    return Response(status_code=204)
