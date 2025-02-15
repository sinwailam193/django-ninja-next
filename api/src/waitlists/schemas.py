from ninja import Schema
from datetime import datetime
from pydantic import EmailStr


class WaitlistEntryCreateSchema(Schema):
    email: EmailStr


class WaitlistEntryDetailSchema(Schema):
    id: int
    email: EmailStr
    timestamp: datetime


class WaitlistEntryListSchema(Schema):
    id: int
    email: EmailStr
