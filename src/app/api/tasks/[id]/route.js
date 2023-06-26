import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Task from "@/models/Task";

// export const GET = async (request, { params }) => {
//   const { id } = params;

//   try {
//     await connect();

//     const post = await Task.findById(id);

//     return new NextResponse(JSON.stringify(post), { status: 200 });
//   } catch (err) {
//     return new NextResponse("Database Error", { status: 500 });
//   }
// };

export const DELETE = async (request, { params }) => {
  const { id } = params;

  try {
    await connect();

    await Task.findByIdAndDelete(id);

    return new NextResponse("Post has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  const { id } = params;

  await connect();
  
    try {
      await Task.findByIdAndUpdate(id, { $set: { status: "completed" } });
      return new NextResponse("Post has been deleted", { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  // }
};

export const PUT = async (request, { params }) => {
  const { id } = params;
  const { title, desc, dueDate } = await request.json();

  try {
    await connect();

    await Task.findByIdAndUpdate(id, {
      $set: { title: title, desc: desc, dueDate: dueDate },
    });

    return new NextResponse("Post has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};
