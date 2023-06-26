import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Task from "@/models/Task";

export const GET = async (request) => {
  const url = new URL(request.url);

  const username = url.searchParams.get("username");  

  try {
    await connect();

    const tasks = await Task.find(username && {username});
    if (tasks.length > 0) {
      let date = new Date();
      tasks.map((userTask) => {
        let taskDate = new Date(userTask.dueDate);
        userTask.dueDate = taskDate;

        if (
          userTask.status === "progress" &&
          userTask.status !== "completed" &&
          taskDate < date
        ) {
          userTask.status = "pending";
        }
      })
    }

    return new NextResponse(JSON.stringify(tasks), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request) => {
  const body = await request.json();

  const newTask = new Task(body);

  try {
    await connect();

    await newTask.save();

    return new NextResponse("Post has been created", { status: 201 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};
