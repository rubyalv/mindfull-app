export const API_URL = "http://127.0.0.1:8000/tasks"; // local dev server

export const getTasks = async () => {
  const res = await fetch(`${API_URL}`);
  const data = await res.json();
  return data.tasks;
};

export const addTask = async (task) => {
  const res = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  const data = await res.json();
  return data;
};
