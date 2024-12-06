import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a User
  const user = await prisma.user.create({
    data: {
      email: "test2@example.com",
      username: "Johnson Doe",
      password: "securepassword",
    },
  });

  console.log("User created:", user);

  // Create an Expert
  const expert = await prisma.expert.create({
    data: {
      expertName: "Jane Smith",
      password: "expertpassword",
      email: "jane.smith@example.com",
      companyName: "Finance Solutions LLC",
      introduction: "We provide top-notch financial advisory services.",
      estimatedPrice: 100.0,
      yearsInService: 5,
      numOfEmployees: 10,
      businessHours: {
        Monday: { open: "9:00", close: "18:00" },
        Tuesday: { open: "9:00", close: "18:00" },
        Wednesday: { open: "9:00", close: "18:00" },
        Thursday: { open: "9:00", close: "18:00" },
        Friday: { open: "9:00", close: "18:00" },
      },
      paymentMethods: ["Credit Card", "Cash", "Online Transfer"],
      background: "Background checked and certified.",
      similarJobsNearYou: 15,
      categories: ["Accountant", "CFO", "Certified Financial Advisor"],
    },
  });

  console.log("Expert created:", expert);

  // Create a Review
  const review = await prisma.review.create({
    data: {
      expertId: expert.expertId, // Link to the expert
      userId: user.userId,       // Link to the user
      numOfStars: 4,
      review: "Excellent service and professional behavior.",
    },
  });

  console.log("Review created:", review);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
