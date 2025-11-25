// import { db } from "@/server/db";
// import { Webhook } from "svix";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";

// export const POST = async (req: Request) => {
//     const { data } = await req.json();
//     console.log(data);
//     const emailAddress = data.email_addresses[0].email_address;
//     const firstName = data.first_name;
//     const lastName = data.last_name;
//     const imageUrl = data.image_url;
//     const id = data.id;

//     await db.user.create({
//   data: {
//     id: id,
//     emailAddress: emailAddress,
//     firstName: firstName,
//     lastName: lastName,
//     imageUrl: imageUrl,
//   }
// })

//     // await db.user.upsert({
//     //     where: { id },
//     //     update: { emailAddress, firstName, lastName, imageUrl },
//     //     create: { id, emailAddress, firstName, lastName, imageUrl },
//     // });

//     return new   Response('Recieved',{status:200  });
// }
import { db } from "@/server/db";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const data = body?.data;

  console.log("Webhook Data:", data);

  // Safely extract values
  const emailAddress =
    data?.email_addresses?.[0]?.email_address ??
    data?.email_address ??
    null;

  if (!emailAddress) {
    console.log("Webhook missing email → skipping insert");
    return new Response("Email missing", { status: 400 });
  }

  const firstName = data?.first_name || null;
  const lastName = data?.last_name || null;
  const imageUrl = data?.image_url || null;
  const id = data?.id;

  if (!id) {
    return new Response("Invalid webhook payload: missing ID", {
      status: 400,
    });
  }

  // Use UPSERT to avoid duplicate errors
  await db.user.upsert({
    where: { id },
    update: { emailAddress, firstName, lastName, imageUrl },
    create: { id, emailAddress, firstName, lastName, imageUrl },
  });

  return new Response("Received", { status: 200 });
};
