from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, database
from pydantic import BaseModel

# Create all DB defined in models.py
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Which front ends are allowed to talk to backend
origins = [
    "http://localhost:19000",  # Expo Go app on web
    "http://localhost:19006",  # Expo web simulator
    "http://localhost:3000",   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"],     # ["*"] for testing only
    allow_credentials=True,
    allow_methods=["*"],       # GET, POST, DELETE, PUT, etc.
    allow_headers=["*"],       # any headers including Content-Type
)
# Process to connect to db
def get_db():
    db = database.SessionLocal() # Creates new session
    try:
        yield db
    finally:
        db.close()


# CREATE a task
@app.post("/tasks/", response_model = schemas.TaskRead)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(title=task.title, 
                          username = task.username)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


# GET tasks from user 
@app.get("/tasks/", response_model = list[schemas.TaskRead])
def read_tasks(username: str, db: Session = Depends(get_db)):
    return db.query(models.Task).filter(models.Task.username == username).all()



# DELETE a task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted"}


@app.get("/")
def read_root():
    return {"message": "Hello, Mindfull App!"}


