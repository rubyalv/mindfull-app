from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    username: str

class TaskRead(BaseModel):
    id: int
    title: str
    username: str

    class Config:
        orm_mode = True
