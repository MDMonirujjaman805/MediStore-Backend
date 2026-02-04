// import { prisma } from "./../src/lib/prisma";
// import { Role } from "../generated/prisma/enums";

// import * as bcrypt from "bcryptjs";

// async function main() {
//   // Hash password
//   const hashedPassword = await bcrypt.hash("Admin@123", 10);

//   // Create admin user
//   const admin = await prisma.user.upsert({
//     where: { email: "admin1@medistore.com" },
//     update: {},
//     create: {
//       email: "admin1@medistore.com",
//       password: hashedPassword,
//       name: "Admin User 1",
//       image: "/images/categories/pain-relief.jpg",
//       //   phone: "+1234567890",
//       role: Role.ADMIN,
//       //   role: "ADMIN",
//       //   isActive: true,
//     },
//   });

//   console.log("✅ Admin user created:");
//   console.log("📧 Email: admin@medistore.com");
//   console.log("🔑 Password: Admin@123");
//   console.log("");
//   console.log(admin);

//   //   // Create categories
//   //   const categories = await Promise.all([
//   //     prisma.category.create({
//   //       data: {
//   //         name: "Pain Relief",
//   //         description: "Medicines for pain management",
//   //         image: "/images/categories/pain-relief.jpg",
//   //       },
//   //     }),
//   //     prisma.category.create({
//   //       data: {
//   //         name: "Cold & Flu",
//   //         description: "Medicines for cold and flu symptoms",
//   //         image: "/images/categories/cold-flu.jpg",
//   //       },
//   //     }),
//   //     prisma.category.create({
//   //       data: {
//   //         name: "Digestive Health",
//   //         description: "Medicines for digestive issues",
//   //         image: "/images/categories/digestive.jpg",
//   //       },
//   //     }),
//   //     prisma.category.create({
//   //       data: {
//   //         name: "Vitamins & Supplements",
//   //         description: "Health supplements and vitamins",
//   //         image: "/images/categories/vitamins.jpg",
//   //       },
//   //     }),
//   //     prisma.category.create({
//   //       data: {
//   //         name: "First Aid",
//   //         description: "First aid and wound care products",
//   //         image: "/images/categories/first-aid.jpg",
//   //       },
//   //     }),
//   //   ]);

//   //   console.log("✅ Categories created");

//   //   // Create a demo seller
//   //   const seller = await prisma.user.create({
//   //     data: {
//   //       email: "seller@medistore.com",
//   //       password: hashedPassword,
//   //       name: "Demo Pharmacy",
//   //       //   phone: "+1234567891",
//   //       //   role: Role.SELLER,
//   //       role: "SELLER",
//   //       //   isActive: true,
//   //     },
//   //   });

//   //   console.log("✅ Demo seller created:");
//   //   console.log("📧 Email: seller@medistore.com");
//   //   console.log("🔑 Password: Admin@123");
//   //   console.log("");

//   //   // Create sample medicines
//   //   const medicines = await Promise.all([
//   //     prisma.medicine.create({
//   //       data: {
//   //         name: "Paracetamol 500mg",
//   //         description:
//   //           "Effective pain relief and fever reducer. Safe for adults and children.",
//   //         price: 5.99,
//   //         stock: 100,
//   //         manufacturer: "PharmaCorp",
//   //         categoryId: categories[0].id,
//   //         sellerId: seller.id,
//   //         imageUrl: "/images/medicines/paracetamol.jpg",
//   //         // requiresPrescription: false,
//   //       },
//   //     }),
//   //     prisma.medicine.create({
//   //       data: {
//   //         name: "Ibuprofen 200mg",
//   //         description:
//   //           "Anti-inflammatory pain reliever for headaches, muscle aches, and arthritis.",
//   //         price: 8.99,
//   //         stock: 75,
//   //         manufacturer: "HealthPlus",
//   //         categoryId: categories[0].id,
//   //         sellerId: seller.id,
//   //         imageUrl: "/images/medicines/ibuprofen.jpg",
//   //         // requiresPrescription: false,
//   //       },
//   //     }),
//   //     prisma.medicine.create({
//   //       data: {
//   //         name: "Cough Syrup",
//   //         description: "Relieves cough and soothes throat irritation.",
//   //         price: 12.5,
//   //         stock: 50,
//   //         manufacturer: "MediCare",
//   //         categoryId: categories[1].id,
//   //         sellerId: seller.id,
//   //         imageUrl: "/images/medicines/cough-syrup.jpg",
//   //         // requiresPrescription: false,
//   //       },
//   //     }),
//   //     prisma.medicine.create({
//   //       data: {
//   //         name: "Vitamin C 1000mg",
//   //         description: "Immune system support with high-potency vitamin C.",
//   //         price: 15.99,
//   //         stock: 120,
//   //         manufacturer: "VitaLife",
//   //         categoryId: categories[3].id,
//   //         sellerId: seller.id,
//   //         imageUrl: "/images/medicines/vitamin-c.jpg",
//   //         // requiresPrescription: false,
//   //       },
//   //     }),
//   //     prisma.medicine.create({
//   //       data: {
//   //         name: "Antacid Tablets",
//   //         description: "Fast relief from heartburn and acid indigestion.",
//   //         price: 9.99,
//   //         stock: 60,
//   //         manufacturer: "DigestWell",
//   //         categoryId: categories[2].id,
//   //         sellerId: seller.id,
//   //         imageUrl: "/images/medicines/antacid.jpg",
//   //         // requiresPrescription: false,
//   //       },
//   //     }),
//   //     prisma.medicine.create({
//   //       data: {
//   //         name: "Antiseptic Cream",
//   //         description: "Prevents infection in minor cuts and burns.",
//   //         price: 7.5,
//   //         stock: 80,
//   //         manufacturer: "FirstAid Co",
//   //         categoryId: categories[4].id,
//   //         sellerId: seller.id,
//   //         imageUrl: "/images/medicines/antiseptic.jpg",
//   //         // requiresPrescription: false,
//   //       },
//   //     }),
//   //   ]);

//   //   console.log("✅ Sample medicines created");

//   //   // Create a demo customer
//   //   const customer = await prisma.user.create({
//   //     data: {
//   //       email: "customer@example.com",
//   //       password: hashedPassword,
//   //       name: "John Doe",
//   //       //   phone: "+1234567892",
//   //       // role: AuthRole.CUSTOMER,
//   //       //   role: Role.CUSTOMER,
//   //       role: "CUSTOMER",
//   //       //   isActive: true,
//   //     },
//   //   });

//   //   console.log("✅ Demo customer created:");
//   //   console.log("📧 Email: customer@example.com");
//   //   console.log("🔑 Password: Admin@123");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { Role } from "../generated/prisma/enums";
import { prisma } from "./../src/lib/prisma";
import * as bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "monirujjaman835@gmail.com" },
    update: {},
    create: {
      email: "monirujjaman835@gmail.com",
      name: "Monirujjaman",
      password: hashedPassword,
      role: Role.ADMIN,
      emailVerified: true,
      image: "images/image.jpeg",
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// import bcrypt from "bcryptjs";
// import { prisma } from "./../src/lib/prisma";
// import { Role } from "./../generated/prisma/enums";

// async function seedAdmin() {
//   try {
//     const hashedPassword = await bcrypt.hash("admin123", 10);

//     console.log("***** Admin Seeding Started....");
//     const adminData = {
//       name: "User",
//       email: "user@admin.com",
//       role: Role.CUSTOMER,
//       password: hashedPassword,
//     };
//     console.log("***** Checking Admin Exist or not");
//     // check user exist on db or not
//     const existingUser = await prisma.user.findUnique({
//       where: {
//         email: adminData.email,
//       },
//     });

//     if (existingUser) {
//       throw new Error("User already exists!!");
//     }

//     const signUpAdmin = await fetch(
//       "http://localhost:5000/api/auth/sign-up/email",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(adminData),
//       },
//     );

//     if (signUpAdmin.ok) {
//       console.log("**** Admin created");
//       await prisma.user.update({
//         where: {
//           email: adminData.email,
//         },
//         data: {
//           emailVerified: true,
//         },
//       });

//       console.log("**** Email verification status updated!");
//     }
//     console.log("******* SUCCESS ******");
//     console.log(signUpAdmin);
//   } catch (error) {
//     console.error(error);
//   }
// }

// seedAdmin();
