from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from uuid import UUID

class Attendee(BaseModel):
    id: UUID
    user_id: UUID
    status: str
    created_at: datetime

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    color: Optional[str] = None
    department: Optional[str] = None
    meeting_type: Optional[str] = None
    attendee_ids: Optional[List[UUID]] = None

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    color: Optional[str] = None
    department: Optional[str] = None
    meeting_type: Optional[str] = None
    attendee_ids: Optional[List[UUID]] = None

class MeetingResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    start_time: datetime
    end_time: datetime
    organizer_id: UUID
    canceled: bool
    color: Optional[str]
    department: Optional[str]
    meeting_type: Optional[str]
    created_at: datetime
    attendees: List[Attendee]