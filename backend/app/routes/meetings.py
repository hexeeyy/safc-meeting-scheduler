from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config.supabase import supabase
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/meetings", tags=["meetings"])
security = HTTPBearer()

class Attendee(BaseModel):
    user_id: str
    status: str = "pending"

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    color: Optional[str] = None
    department: Optional[str] = None
    meeting_type: Optional[str] = None
    attendee_ids: Optional[List[str]] = None

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    color: Optional[str] = None
    department: Optional[str] = None
    meeting_type: Optional[str] = None
    attendee_ids: Optional[List[str]] = None
    canceled: Optional[bool] = None

class MeetingResponse(BaseModel):
    id: str
    title: str
    start: datetime = Field(..., alias="start_time")
    end: datetime = Field(..., alias="end_time")
    color: Optional[str] = None
    department: Optional[str] = None
    meetingType: Optional[str] = Field(..., alias="meeting_type")
    creator: str = Field(..., alias="organizer_id")
    attendees: List[Attendee]
    canceled: bool
    description: Optional[str] = None

    class Config:
        allow_population_by_field_name = True

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user_response = supabase.auth.get_user(token)
    if not user_response.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return user_response.user

@router.post("/create", response_model=MeetingResponse)
async def create_meeting(meeting: MeetingCreate, user=Depends(get_current_user)):
    try:
        data, error = (
            supabase.table("meetings")
            .insert(
                {
                    "title": meeting.title,
                    "description": meeting.description,
                    "start_time": meeting.start_time.isoformat(),
                    "end_time": meeting.end_time.isoformat(),
                    "organizer_id": user.id,
                    "color": meeting.color,
                    "department": meeting.department,
                    "meeting_type": meeting.meeting_type,
                    "canceled": False,
                }
            )
            .execute()
        )

        if error:
            raise HTTPException(status_code=500, detail=error.message)

        meeting_data = data[1][0]

        attendees = []
        if meeting.attendee_ids:
            attendee_inserts = [
                {"meeting_id": meeting_data["id"], "user_id": str(attendee_id), "status": "pending"}
                for attendee_id in meeting.attendee_ids
            ]
            attendees_data, attendees_error = (
                supabase.table("attendees").insert(attendee_inserts).execute()
            )
            if attendees_error:
                raise HTTPException(status_code=500, detail=attendees_error.message)
            attendees = attendees_data[1]

        meeting_data["attendees"] = attendees
        return MeetingResponse(**meeting_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[MeetingResponse])
async def get_meetings(
    user=Depends(get_current_user),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    include_canceled: bool = False
):
    try:
        query = supabase.table("meetings").select("*").eq("organizer_id", user.id)
    
        if start_date:
            query = query.gte("start_time", start_date)
        if end_date:
            query = query.lte("end_time", end_date)
        if not include_canceled:
            query = query.eq("canceled", False)

        meetings_data, meetings_error = query.execute()

        if meetings_error:
            raise HTTPException(status_code=500, detail=meetings_error.message)
        
        result = []
        for meeting in meetings_data[1]:
            attendees_data, attendees_error = (
                supabase.table("attendees")
                .select("*")
                .eq("meeting_id", meeting["id"])
                .execute()
            )
            if attendees_error:
                raise HTTPException(status_code=500, detail=attendees_error.message)
            meeting["attendees"] = attendees_data[1]
            result.append(MeetingResponse(**meeting))

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{meeting_id}", response_model=MeetingResponse)
async def update_meeting(meeting_id: UUID, meeting: MeetingUpdate, user=Depends(get_current_user)):
    try:

        meeting_check, error = (
            supabase.table("meetings")
            .select("organizer_id")
            .eq("id", str(meeting_id))
            .eq("organizer_id", user.id)
            .execute()
        )

        if error or not meeting_check[1]:
            raise HTTPException(status_code=403, detail="Not authorized or meeting not found")
        
        update_data = {}
        if meeting.title is not None:
            update_data["title"] = meeting.title
        if meeting.description is not None:
            update_data["description"] = meeting.description
        if meeting.start_time is not None:
            update_data["start_time"] = meeting.start_time.isoformat()
        if meeting.end_time is not None:
            update_data["end_time"] = meeting.end_time.isoformat()
        if meeting.color is not None:
            update_data["color"] = meeting.color
        if meeting.department is not None:
            update_data["department"] = meeting.department
        if meeting.meeting_type is not None:
            update_data["meeting_type"] = meeting.meeting_type
        if meeting.canceled is not None:
            update_data["canceled"] = meeting.canceled

        data, error = (
            supabase.table("meetings")
            .update(update_data)
            .eq("id", str(meeting_id))
            .execute()
        )

        if error:
            raise HTTPException(status_code=500, detail=error.message)

        if meeting.attendee_ids is not None:
            _, delete_error = (
                supabase.table("attendees")
                .delete()
                .eq("meeting_id", str(meeting_id))
                .execute()
            )
            if delete_error:
                raise HTTPException(status_code=500, detail=delete_error.message)

            if meeting.attendee_ids:
                attendee_inserts = [
                    {"meeting_id": str(meeting_id), "user_id": str(attendee_id), "status": "pending"}
                    for attendee_id in meeting.attendee_ids
                ]
                attendees_data, attendees_error = (
                    supabase.table("attendees").insert(attendee_inserts).execute()
                )
                if attendees_error:
                    raise HTTPException(status_code=500, detail=attendees_error.message)

        meeting_data, error = (
            supabase.table("meetings")
            .select("*")
            .eq("id", str(meeting_id))
            .single()
            .execute()
        )
        if error:
            raise HTTPException(status_code=500, detail=error.message)

        attendees_data, attendees_error = (
            supabase.table("attendees")
            .select("*")
            .eq("meeting_id", str(meeting_id))
            .execute()
        )
        if attendees_error:
            raise HTTPException(status_code=500, detail=attendees_error.message)

        meeting_data[1]["attendees"] = attendees_data[1]
        return MeetingResponse(**meeting_data[1])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{meeting_id}")
async def cancel_meeting(meeting_id: UUID, user=Depends(get_current_user)):
    try:
        meeting_check, error = (
            supabase.table("meetings")
            .select("organizer_id")
            .eq("id", str(meeting_id))
            .eq("organizer_id", user.id)
            .execute()
        )

        if error or not meeting_check[1]:
            raise HTTPException(status_code=403, detail="Not authorized or meeting not found")

        data, error = (
            supabase.table("meetings")
            .update({"canceled": True})
            .eq("id", str(meeting_id))
            .execute()
        )

        if error:
            raise HTTPException(status_code=500, detail=error.message)

        return {"message": "Meeting canceled"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{meeting_id}/resize", response_model=MeetingResponse)
async def resize_meeting(
    meeting_id: UUID,
    start_time: datetime,
    end_time: datetime,
    user=Depends(get_current_user)
):
    try:
        meeting_check, error = (
            supabase.table("meetings")
            .select("organizer_id")
            .eq("id", str(meeting_id))
            .eq("organizer_id", user.id)
            .execute()
        )

        if error or not meeting_check[1]:
            raise HTTPException(status_code=403, detail="Not authorized or meeting not found")
        
        data, error = (
            supabase.table("meetings")
            .update({
                "start_time": start_time.isoformat(),
                "end_time": end_time.isoformat()
            })
            .eq("id", str(meeting_id))
            .execute()
        )

        if error:
            raise HTTPException(status_code=500, detail=error.message)

        meeting_data, error = (
            supabase.table("meetings")
            .select("*")
            .eq("id", str(meeting_id))
            .single()
            .execute()
        )
        if error:
            raise HTTPException(status_code=500, detail=error.message)

        attendees_data, attendees_error = (
            supabase.table("attendees")
            .select("*")
            .eq("meeting_id", str(meeting_id))
            .execute()
        )
        if attendees_error:
            raise HTTPException(status_code=500, detail=attendees_error.message)

        meeting_data[1]["attendees"] = attendees_data[1]
        return MeetingResponse(**meeting_data[1])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))