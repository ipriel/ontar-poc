import logging
from asyncio import Queue, QueueEmpty
from typing import AsyncIterable, Set
from backend.utils.data import Message, EventType

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

class Broker:
    connections: Set[Queue[str]]
    last_message: Message | None

    def __init__(self) -> None:
        self.connections = set()
        self.last_message = None

    async def publish(self, message: Message) -> None:
        if (message.type == EventType.UPDATE and self.last_message != None):
            self.last_message.merge(message)
        elif message.type == EventType.NEW or message.type == EventType.CLOSE:
            self.last_message = message
        
        for connection in self.connections:
            if message.type == EventType.CLOSE:
                try:
                    while not connection.empty():
                        connection.get_nowait()
                        connection.task_done()
                except QueueEmpty:
                    logger.exception("connection.get() was called on an empty Queue")
                except Exception as e:
                    logger.exception("Unknown Exception while clearing message queue: %s", repr(e))
                
            await connection.put(message.toJSONString())

    async def subscribe(self) -> AsyncIterable[str]:
        connection = Queue(2)
        if self.last_message:
            await connection.put(self.last_message.toJSONString())
        self.connections.add(connection)
        try:
            while True:
                yield await connection.get()
        finally:
            self.connections.remove(connection)