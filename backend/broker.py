import asyncio
from typing import AsyncGenerator

class Broker:
    def __init__(self) -> None:
        self.connections = set()
        self.last_message = None

    async def publish(self, message: str) -> None:
        self.last_message = message
        for connection in self.connections:
            await connection.put(message)

    async def subscribe(self) -> AsyncGenerator[str, None]:
        connection = asyncio.Queue(2)
        if self.last_message:
            connection.put(self.last_message)
        self.connections.add(connection)
        try:
            while True:
                yield await connection.get()
        finally:
            self.connections.remove(connection)