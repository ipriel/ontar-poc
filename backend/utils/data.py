import json
from kiota_serialization_json.json_serialization_writer_factory import JsonSerializationWriterFactory
from msgraph_beta.generated.models.risky_user import RiskyUser
from msgraph_beta.generated.models.alert import Alert
from msgraph_beta.generated.models.security.incident import Incident
from typing import Self, Dict
from enum import StrEnum

_jsonSerializer = JsonSerializationWriterFactory().get_serialization_writer('application/json')

def serialize(obj: RiskyUser | Alert | Incident):
    obj.serialize(writer=_jsonSerializer)
    jsonStr = _jsonSerializer.get_serialized_content().decode()
    return json.loads(jsonStr)

def format_as_ndjson(obj: dict) -> str:
    return json.dumps(obj, ensure_ascii=False) + "\n"

class EventType(StrEnum):
    NEW = "new_event"
    UPDATE = "update_event"
    CLOSE = "close_event"

class Message():
    type: EventType
    payload: Dict[str, str | int]

    def __init__(self, message_type: EventType, payload: Dict[str, str | int]) -> None:
        self.type = message_type
        self.payload = payload

    def toJSONString(self) -> str:
        return json.dumps({'message_type': str(self.type), 'payload': self.payload})
    
    def merge(self, newMessage: Self) -> None:
        self.type = newMessage.type
        self.payload |= newMessage.payload