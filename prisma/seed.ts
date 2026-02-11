import { PrismaClient, UserRole, ClientStatus, JobStatus, TaskStatus, TaskPriority } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.invoiceLineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.task.deleteMany();
  await prisma.job.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  const owner = await prisma.user.create({
    data: {
      name: "Owner",
      email: "owner@demo.com",
      role: UserRole.OWNER,
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: "Staff",
      email: "staff@demo.com",
      role: UserRole.STAFF,
    },
  });

  const client = await prisma.client.create({
    data: {
      name: "Acme Plumbing Co.",
      primaryContactName: "Jordan Smith",
      email: "jordan@acmeplumbing.com",
      phone: "555-555-5555",
      status: ClientStatus.ACTIVE,
      notes: "Prefers text updates.",
    },
  });

  const job = await prisma.job.create({
    data: {
      clientId: client.id,
      title: "Water heater replacement",
      description: "Replace 40-gallon gas water heater and haul away old unit.",
      status: JobStatus.SCHEDULED,
      assignedUserId: staff.id,
      scheduledDate: new Date(),
    },
  });

  await prisma.task.createMany({
    data: [
      {
        jobId: job.id,
        title: "Confirm model + parts list",
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        assignedUserId: staff.id,
      },
      {
        jobId: job.id,
        title: "Schedule customer window",
        status: TaskStatus.DOING,
        priority: TaskPriority.MEDIUM,
        assignedUserId: owner.id,
      },
    ],
  });

  console.log("Seed complete:", { owner: owner.email, staff: staff.email, client: client.name, job: job.title });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
