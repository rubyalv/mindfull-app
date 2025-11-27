from fastapi import APIRouter

router = APIRouter()

# Sample in-memory storage for tasks
tasks = []

@router.post("/add")
def add_task(task: dict):
    """
    Add a new task.
    Example POST body: {"title": "Write essay"}
    """
    tasks.append(task)
    return {"message": "Task added!", "tasks": tasks}

@router.get("/")
def get_tasks():
    """Return all tasks"""
    return {"tasks": tasks}
