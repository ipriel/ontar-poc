import json
from kiota_serialization_json.json_serialization_writer_factory import JsonSerializationWriterFactory
from msgraph_beta.generated.models.risky_user import RiskyUser
from msgraph_beta.generated.models.alert import Alert

_jsonSerializer = JsonSerializationWriterFactory().get_serialization_writer('application/json')

def serialize(obj: RiskyUser | Alert):
    obj.serialize(writer=_jsonSerializer)
    str = _jsonSerializer.get_serialized_content().decode()
    return json.loads(str)

def format_as_ndjson(obj: dict) -> str:
    return json.dumps(obj, ensure_ascii=False) + "\n"