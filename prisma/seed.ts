import { PrismaClient, UploadStatus } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function seedFiles() {
  console.log("Seeding files...");

  // First clear existing data
  await prisma.file.deleteMany();

  // Create sample users if needed
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      id: randomUUID(),
      email: "test@example.com",
      name: "Test User",
    },
  });

  // Create sample files
  const files = [
    {
      id: randomUUID(),
      name: "Sample PDF 1",
      uploadStatus: UploadStatus.PENDING,
      url: "https://example.com/sample1.pdf",
      key: "sample1.pdf",
      userId: user.id,
    },
    {
      id: randomUUID(),
      name: "Sample PDF 2",
      uploadStatus: UploadStatus.PENDING,
      url: "https://example.com/sample2.pdf",
      key: "sample2.pdf",
      userId: user.id,
    },
    {
      id: randomUUID(),
      name: "Upload in Progress",
      uploadStatus: UploadStatus.PENDING,
      key: "pending.pdf",
      userId: user.id,
    },
    {
      id: randomUUID(),
      name: "Failed Upload",
      uploadStatus: UploadStatus.PENDING,
      key: "failed.pdf",
      userId: user.id,
    },
    {
      id: randomUUID(),
      name: "Failed Upload",
      uploadStatus: UploadStatus.PENDING,
      key: "failed.pdf",
      userId: user.id,
    },
    {
      id: randomUUID(),
      name: "Failed Upload",
      uploadStatus: UploadStatus.PENDING,
      key: "failed.pdf",
      userId: user.id,
    },
    {
      id: randomUUID(),
      name: "Failed Upload",
      uploadStatus: UploadStatus.PENDING,
      key: "failed.pdf",
      userId: user.id,
    },
  ];

  for (const file of files) {
    await prisma.file.create({
      data: file,
    });
  }

  console.log(`Seeded ${files.length} files`);
}

async function main() {
  try {
    await seedFiles();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
