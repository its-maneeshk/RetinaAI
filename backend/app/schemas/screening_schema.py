from datetime import date, datetime, timezone
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator
from app.models.screening_record import ScreeningRecord

GRADE_LABELS = ['No DR', 'Mild DR', 'Moderate DR', 'Severe DR', 'Proliferative DR']


class CaseMetadata(BaseModel):
    model_config = ConfigDict(extra='forbid')
    case_id: str = Field(pattern=r'^CASE-[A-Za-z0-9-]{2,40}$', max_length=50)
    patient_reference: str = Field(pattern=r'^SYN-[A-Za-z0-9-]{2,32}$', max_length=36)
    age: int | None = Field(default=None, ge=0, le=120)
    screening_date: date
    eye: Literal['LEFT', 'RIGHT', 'UNSPECIFIED'] = 'UNSPECIFIED'

    @field_validator('screening_date')
    @classmethod
    def reasonable_date(cls, value: date) -> date:
        if value.year < 2000 or value.year > datetime.now(timezone.utc).year + 1:
            raise ValueError('Choose a research date between 2000 and next year.')
        return value


class SaveRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')
    record_id: str = Field(min_length=6, max_length=40, pattern=r'^DR-[A-Za-z0-9-]+$')


class ExplanationResponse(BaseModel):
    method: Literal['GRAD_CAM']
    model_version: str
    original_image: str
    heatmap_image: str


class PredictionResponse(BaseModel):
    explainability: ExplanationResponse | None = None
    record_id: str
    case_id: str
    patient_reference: str
    age: int | None
    eye: Literal['LEFT', 'RIGHT', 'UNSPECIFIED']
    screening_date: date
    predicted_grade: int = Field(ge=0, le=4)
    predicted_label: str
    model_score: float = Field(ge=0, le=1)
    model_version: str
    model_type: Literal['DEMO', 'TRAINED']
    quality_status: Literal['ACCEPTABLE', 'WARNING', 'REJECTED']
    quality_messages: list[str]
    timestamp: datetime
    is_demo: bool
    is_saved: bool
    probabilities: list[float] = Field(min_length=5, max_length=5)
    image_available: bool
    image_width: int
    image_height: int
    analysis_ms: float


def serialize_record(record: ScreeningRecord) -> PredictionResponse:
    return PredictionResponse(
        record_id=record.record_id, case_id=record.case_id,
        patient_reference=record.patient_reference, age=record.age, eye=record.eye,
        screening_date=record.screening_date, predicted_grade=record.predicted_grade,
        predicted_label=record.predicted_label, model_score=record.model_score,
        model_version=record.model_version, model_type=record.model_type,
        quality_status=record.quality_status, quality_messages=record.quality_messages,
        timestamp=record.screening_timestamp.replace(tzinfo=timezone.utc),
        is_demo=record.model_type == 'DEMO', is_saved=record.is_saved,
        probabilities=record.probabilities, image_available=bool(record.image_filename),
        image_width=record.image_width, image_height=record.image_height,
        analysis_ms=record.analysis_ms,
    )


class HistoryResponse(BaseModel):
    records: list[PredictionResponse]
    total: int
    page: int
    page_size: int
