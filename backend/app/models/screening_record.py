from datetime import date, datetime
from sqlalchemy import JSON, Boolean, Date, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from app.models.database import Base


class ScreeningRecord(Base):
    __tablename__ = 'screening_records'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    record_id: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    case_id: Mapped[str] = mapped_column(String(50))
    patient_reference: Mapped[str] = mapped_column(String(36), index=True)
    age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    eye: Mapped[str] = mapped_column(String(12), default='UNSPECIFIED')
    screening_date: Mapped[date] = mapped_column(Date)
    image_filename: Mapped[str | None] = mapped_column(String(64), nullable=True)
    predicted_grade: Mapped[int] = mapped_column(Integer)
    predicted_label: Mapped[str] = mapped_column(String(40))
    model_score: Mapped[float] = mapped_column(Float)
    quality_status: Mapped[str] = mapped_column(String(12))
    quality_messages: Mapped[list[str]] = mapped_column(JSON)
    model_version: Mapped[str] = mapped_column(String(64))
    model_type: Mapped[str] = mapped_column(String(10))
    screening_timestamp: Mapped[datetime] = mapped_column(DateTime, index=True)
    is_saved: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    probabilities: Mapped[list[float]] = mapped_column(JSON)
    image_width: Mapped[int] = mapped_column(Integer, default=0)
    image_height: Mapped[int] = mapped_column(Integer, default=0)
    analysis_ms: Mapped[float] = mapped_column(Float, default=0)
