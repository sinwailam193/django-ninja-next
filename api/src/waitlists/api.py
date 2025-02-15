from ninja_extra import Router
from typing import List
from django.shortcuts import get_object_or_404

from .schemas import WaitlistEntryListSchema, WaitlistEntryDetailSchema
from .models import WaitlistEntry

router = Router()


@router.get("", response=List[WaitlistEntryListSchema])
def list_waitlist_entries(request):
    return WaitlistEntry.objects.all()


@router.get("/{entry_id}", response=WaitlistEntryDetailSchema)
def get_waitlist_entry(request, entry_id: int):
    obj = get_object_or_404(WaitlistEntry, id=entry_id)
    return obj
