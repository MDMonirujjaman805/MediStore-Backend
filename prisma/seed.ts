// import * as bcrypt from "bcryptjs";
// import { prisma } from "./../src/lib/prisma";
// import { Role } from "../generated/prisma/enums";

// async function main() {
//   const hashedPassword = await bcrypt.hash("admin123", 10);

//   const admin = await prisma.user.upsert({
//     where: { email: "monirujjaman835@gmail.com" },
//     update: {},
//     create: {
//       email: "monirujjaman835@gmail.com",
//       name: "Monirujjaman",
//       password: hashedPassword,
//       role: Role.ADMIN,
//       emailVerified: true,
//       image: "images/image.jpeg",
//     },
//   });

//   console.log({ admin });

//   // Create categories
//   const categories = await Promise.all([
//     prisma.category.create({
//       data: {
//         name: "Pain Relief",
//         description: "Medicines for pain management",
//         image: "/images/categories/pain-relief.jpg",
//       },
//     }),
//     prisma.category.create({
//       data: {
//         name: "Cold & Flu",
//         description: "Medicines for cold and flu symptoms",
//         image: "/images/categories/cold-flu.jpg",
//       },
//     }),
//     prisma.category.create({
//       data: {
//         name: "Digestive Health",
//         description: "Medicines for digestive issues",
//         image: "/images/categories/digestive.jpg",
//       },
//     }),
//     prisma.category.create({
//       data: {
//         name: "Vitamins & Supplements",
//         description: "Health supplements and vitamins",
//         image: "/images/categories/vitamins.jpg",
//       },
//     }),
//     prisma.category.create({
//       data: {
//         name: "First Aid",
//         description: "First aid and wound care products",
//         image: "/images/categories/first-aid.jpg",
//       },
//     }),
//   ]);

//   console.log("✅ Categories created");

//   // Create a demo seller
//   const seller = await prisma.user.create({
//     data: {
//       email: "seller@medistore.com",
//       password: hashedPassword,
//       name: "Demo Pharmacy",
//       //   phone: "+1234567891",
//       //   role: Role.SELLER,
//       role: "SELLER",
//       //   isActive: true,
//     },
//   });

//   console.log("✅ Demo seller created:");
//   console.log("📧 Email: seller@medistore.com");
//   console.log("🔑 Password: Admin@123");
//   console.log("");

//   // Create sample medicines
//   const medicines = await Promise.all([
//     prisma.medicine.create({
//       data: {
//         name: "Paracetamol 500mg",
//         description:
//           "Effective pain relief and fever reducer. Safe for adults and children.",
//         price: 5.99,
//         stock: 100,
//         manufacturer: "PharmaCorp",
//         categoryId: categories[0].id,
//         sellerId: seller.id,
//         imageUrl: "/images/medicines/paracetamol.jpg",
//         // requiresPrescription: false,
//       },
//     }),
//     prisma.medicine.create({
//       data: {
//         name: "Ibuprofen 200mg",
//         description:
//           "Anti-inflammatory pain reliever for headaches, muscle aches, and arthritis.",
//         price: 8.99,
//         stock: 75,
//         manufacturer: "HealthPlus",
//         categoryId: categories[0].id,
//         sellerId: seller.id,
//         imageUrl: "/images/medicines/ibuprofen.jpg",
//         // requiresPrescription: false,
//       },
//     }),
//     prisma.medicine.create({
//       data: {
//         name: "Cough Syrup",
//         description: "Relieves cough and soothes throat irritation.",
//         price: 12.5,
//         stock: 50,
//         manufacturer: "MediCare",
//         categoryId: categories[1].id,
//         sellerId: seller.id,
//         imageUrl: "/images/medicines/cough-syrup.jpg",
//         // requiresPrescription: false,
//       },
//     }),
//     prisma.medicine.create({
//       data: {
//         name: "Vitamin C 1000mg",
//         description: "Immune system support with high-potency vitamin C.",
//         price: 15.99,
//         stock: 120,
//         manufacturer: "VitaLife",
//         categoryId: categories[3].id,
//         sellerId: seller.id,
//         imageUrl: "/images/medicines/vitamin-c.jpg",
//         // requiresPrescription: false,
//       },
//     }),
//     prisma.medicine.create({
//       data: {
//         name: "Antacid Tablets",
//         description: "Fast relief from heartburn and acid indigestion.",
//         price: 9.99,
//         stock: 60,
//         manufacturer: "DigestWell",
//         categoryId: categories[2].id,
//         sellerId: seller.id,
//         imageUrl: "/images/medicines/antacid.jpg",
//         // requiresPrescription: false,
//       },
//     }),
//     prisma.medicine.create({
//       data: {
//         name: "Antiseptic Cream",
//         description: "Prevents infection in minor cuts and burns.",
//         price: 7.5,
//         stock: 80,
//         manufacturer: "FirstAid Co",
//         categoryId: categories[4].id,
//         sellerId: seller.id,
//         imageUrl: "/images/medicines/antiseptic.jpg",
//         // requiresPrescription: false,
//       },
//     }),
//   ]);

//   console.log("✅ Sample medicines created");

//   // Create a demo customer
//   const customer = await prisma.user.create({
//     data: {
//       email: "customer@example.com",
//       password: hashedPassword,
//       name: "John Doe",
//       //   phone: "+1234567892",
//       // role: AuthRole.CUSTOMER,
//       //   role: Role.CUSTOMER,
//       role: "CUSTOMER",
//       //   isActive: true,
//     },
//   });

//   console.log("✅ Demo customer created:");
//   console.log("📧 Email: customer@example.com");
//   console.log("🔑 Password: Admin@123");
// }
// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// GPT
import * as bcrypt from "bcryptjs";
// import { prisma } from "@/lib/prisma";
import { prisma } from "../src/lib/prisma";
// import { Role } from "../generated/prisma/enums";
import { Role } from "@prisma/client";

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  /* ---------------- ADMIN ---------------- */
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

  console.log("✅ Admin created:", admin.email);

  /* ---------------- CATEGORIES ---------------- */
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Pain Relief" },
      update: {},
      create: {
        name: "Pain Relief",
        description: "Medicines for pain management",
        image: "/images/categories/pain-relief.jpg",
      },
    }),
    prisma.category.upsert({
      where: { name: "Cold & Flu" },
      update: {},
      create: {
        name: "Cold & Flu",
        description: "Medicines for cold and flu symptoms",
        image: "/images/categories/cold-flu.jpg",
      },
    }),
    prisma.category.upsert({
      where: { name: "Digestive Health" },
      update: {},
      create: {
        name: "Digestive Health",
        description: "Medicines for digestive issues",
        image: "/images/categories/digestive.jpg",
      },
    }),
    prisma.category.upsert({
      where: { name: "Vitamins & Supplements" },
      update: {},
      create: {
        name: "Vitamins & Supplements",
        description: "Health supplements and vitamins",
        image: "/images/categories/vitamins.jpg",
      },
    }),
    prisma.category.upsert({
      where: { name: "First Aid" },
      update: {},
      create: {
        name: "First Aid",
        description: "First aid and wound care products",
        image: "/images/categories/first-aid.jpg",
      },
    }),
  ]);

  console.log("✅ Categories seeded");

  /* ---------------- SELLER ---------------- */
  const seller = await prisma.user.upsert({
    where: { email: "seller@medistore.com" },
    update: {},
    create: {
      email: "seller@medistore.com",
      password: hashedPassword,
      name: "Demo Pharmacy",
      role: Role.SELLER,
      emailVerified: true,
    },
  });

  console.log("✅ Seller created:", seller.email);

  /* ---------------- MEDICINES ---------------- */
  await Promise.all([
    prisma.medicine.create({
      data: {
        name: "Paracetamol 500mg",
        description: "Effective pain relief and fever reducer.",
        price: 5.99,
        stock: 100,
        manufacturer: "PharmaCorp",
        categoryId: categories[0].id,
        sellerId: seller.id,
        imageUrl: "/images/medicines/paracetamol.jpg",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Ibuprofen 200mg",
        description: "Anti-inflammatory pain reliever.",
        price: 8.99,
        stock: 75,
        manufacturer: "HealthPlus",
        categoryId: categories[0].id,
        sellerId: seller.id,
        imageUrl: "/images/medicines/ibuprofen.jpg",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Cough Syrup",
        description: "Relieves cough and soothes throat irritation.",
        price: 12.5,
        stock: 50,
        manufacturer: "MediCare",
        categoryId: categories[1].id,
        sellerId: seller.id,
        imageUrl: "/images/medicines/cough-syrup.jpg",
      },
    }),
  ]);

  console.log("✅ Medicines seeded");

  /* ---------------- CUSTOMER ---------------- */
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      password: hashedPassword,
      name: "John Doe",
      role: Role.CUSTOMER,
      emailVerified: true,
    },
  });

  console.log("✅ Customer created:", customer.email);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

// Gemini
// import * as bcrypt from "bcryptjs";
// import { prisma } from "../src/lib/prisma"; // আপনার প্রজেক্ট পাথ অনুযায়ী চেক করুন
// import { Role } from "../generated/prisma/enums";

// async function main() {
//   const hashedPassword = await bcrypt.hash("admin123", 10);

//   // ১. এডমিন তৈরি বা আপডেট
//   const admin = await prisma.user.upsert({
//     where: { email: "monirujjaman835@gmail.com" },
//     update: {},
//     create: {
//       email: "monirujjaman835@gmail.com",
//       name: "Monirujjaman",
//       password: hashedPassword,
//       role: Role.ADMIN,
//       emailVerified: true,
//       image: "images/image.jpeg",
//     },
//   });

//   console.log("✅ Admin created/verified:", admin.email);

//   // ২. ক্যাটাগরি তৈরি (upsert ব্যবহার করা ভালো যাতে বারবার রান করলে এরর না দেয়)
//   const categoryData = [
//     { name: "Pain Relief", description: "Medicines for pain management" },
//     { name: "Cold & Flu", description: "Medicines for cold and flu symptoms" },
//     { name: "Digestive Health", description: "Medicines for digestive issues" },
//     {
//       name: "Vitamins & Supplements",
//       description: "Health supplements and vitamins",
//     },
//     { name: "First Aid", description: "First aid and wound care products" },
//   ];

//   const categories = await Promise.all(
//     categoryData.map((cat) =>
//       prisma.category.upsert({
//         where: { name: cat.name },
//         update: {},
//         create: cat,
//       }),
//     ),
//   );

//   console.log("✅ Categories ready");

//   // ৩. সেলার তৈরি
//   const seller = await prisma.user.upsert({
//     where: { email: "seller@medistore.com" },
//     update: {},
//     create: {
//       email: "seller@medistore.com",
//       password: hashedPassword,
//       name: "Demo Pharmacy",
//       role: Role.SELLER,
//       emailVerified: true,
//     },
//   });

//   console.log("✅ Demo seller ready");

//   // ৪. মেডিসিন তৈরি
//   await prisma.medicine.createMany({
//     skipDuplicates: true, // যাতে দ্বিতীয়বার রান করলে এরর না দেয়
//     data: [
//       {
//         name: "Paracetamol 500mg",
//         description: "Effective pain relief.",
//         price: 5.99,
//         stock: 100,
//         manufacturer: "PharmaCorp",
//         categoryId: categories[0].id,
//         sellerId: seller.id,
//       },
//       {
//         name: "Vitamin C 1000mg",
//         description: "Immune system support.",
//         price: 15.99,
//         stock: 120,
//         manufacturer: "VitaLife",
//         categoryId: categories[3].id,
//         sellerId: seller.id,
//       },
//     ],
//   });

//   console.log("✅ Sample medicines created");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
