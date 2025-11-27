import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";


// TypeScript type for a Task
type Task = {
    id: number;
    title: string;
    username: string;
    };

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]); // start with 0 tasks
    const [loading, setLoading] = useState<boolean>(true); 
    const [newTaskTitle, setNewTaskTitle] = useState<string>("");

    // Fetch tasks from backend
    const fetchTasks = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/tasks/`);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    // Add a new task (example)
    const addTask = async () => {
        if(!newTaskTitle.trim()) return;
        try {
            const response = await fetch(`http://127.0.0.1:8000/tasks/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTaskTitle, username: "user1" }),
            });

            const task = await response.json();
            setTasks([...tasks, task]);
            setNewTaskTitle("");
        } catch (error) {
            console.error(error);
        };
    };


    const deleteTask = async (taskId: number) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, {
            method: "DELETE", 
        });
        
        setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error(error);
        }
    };


    // useEffect(() => { fetchTasks(); }, []);

    return (

    // <View style={styles.container}>
    //     <Button title="Add Task" onPress={addTask} />
    //     {loading ? (
    //     <Text style={styles.loadingText}>Loading tasks...</Text>
    //     ) : tasks.length === 0 ? (
    //     <Text style={styles.emptyText}>No tasks yet!</Text>
    //     ) : (
    //     <FlatList
    //         data={tasks}
    //         keyExtractor={(item, index) => index.toString()}
    //         renderItem={({ item }) => <Text style={styles.taskText}>{item.title}</Text>}
    //     />
    //     )}
    // </View>

    <View>
        <TextInput
            placeholder="New task"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle} 
        />
        <Button title="Add Task" onPress={addTask} />

        {loading ? <Text>Loading...</Text> : null}

        {tasks.map(task => (
            <View key={task.id}>
            <Text>{task.title}</Text>
            <Button title="Delete" onPress={() => deleteTask(task.id)} />
            </View>
        ))}
    </View>

    );


    } // End of Tasks page

    // const styles = StyleSheet.create({
    // container: {
    // flex: 1,
    // padding: 20,
    // },
    // loadingText: {
    // marginTop: 10,
    // fontSize: 16,
    // color: "#888",
    // },
    // emptyText: {
    // marginTop: 10,
    // fontSize: 16,
    // color: "#888",
    // fontStyle: "italic",
    // },
    // taskText: {
    // fontSize: 18,
    // marginVertical: 5,
    // },
    // });
