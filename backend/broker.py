import asyncio
import json
from typing import AsyncGenerator
from enum import StrEnum

class EventType(StrEnum):
    NEW = "new_event"
    UPDATE = "update_event"
    CLOSE = "close_event"

class Broker:
    def __init__(self) -> None:
        self.connections = set()
        self.last_message = None

    async def publish(self, message_type: EventType, payload: dict) -> None:
        message = {'message_type': str(message_type), 'payload': payload}
        self.last_message = message
        for connection in self.connections:
            await connection.put(json.dumps(message))

    async def subscribe(self) -> AsyncGenerator[str, None]:
        connection = asyncio.Queue(2)
        if self.last_message:
            await connection.put(json.dumps(self.last_message))
        self.connections.add(connection)
        try:
            while True:
                yield await connection.get()
        finally:
            self.connections.remove(connection)