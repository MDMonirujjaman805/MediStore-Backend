import { NextFunction, Request, Response } from "express";
import { orderService } from "./order.service";
import { OrderStatus } from "../../generated/prisma/enums";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // console.log(user);
    const result = await orderService.createOrder(req.body, user.id as string);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    console.log("Search Value :", search);
    const searchString = typeof search === "string" ? search : undefined;
    console.log("Search String Value :", searchString);
    const status = req.query.search as OrderStatus | undefined;
    const orders = await orderService.getAllOrders({ search: searchString, status});
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const orderController = {
  createOrder,
  getAllOrders,
};

// server side example for creating a post with Better Auth

// app/api/create-post/route.ts
// import { auth } from "@/lib/auth"; // path to your Better Auth server instance
// import prisma from "@/lib/prisma"; // path to your database client
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   // 1. Get the user session from Better Auth using request headers
//   const session = await auth.api.getSession({ headers: headers() });

//   // 2. Check if the user is authenticated
//   if (!session || !session.user) {
//     return new NextResponse("Unauthorized", { status: 401 });
//   }

//   // 3. Get the post data from the request body
//   const body = await request.json();
//   const { title, content } = body;

//   if (!title || !content) {
//     return new NextResponse("Missing title or content", { status: 400 });
//   }

//   // 4. Create the post in the database, linking it to the logged-in user
//   try {
//     const post = await prisma.post.create({
//       data: {
//         title,
//         content,
//         userId: session.user.id,
//       },
//     });
//     return NextResponse.json(post, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

// client side example for creating a post with Better Auth

// import { useState } from "react";
// import { useAuth } from "better-auth/react";

// const CreatePost = () => {
//   const { user, isAuthenticated } = useAuth();
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isAuthenticated) {
//       alert("You must be logged in to create a post.");
//       return;
//     }

//     try {
//       const response = await fetch("/api/create-post", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ title, content }),
//       });

//       if (response.ok) {
//         const post = await response.json();
//         console.log("Post created:", post);
//       } else {
//         console.error("Failed to create post");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Post Title"
//         required
//       />
//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Post Content"
//         required
//       />
//       <button type="submit">Create Post</button>
//     </form>
//   );
// };

// export default CreatePost;
