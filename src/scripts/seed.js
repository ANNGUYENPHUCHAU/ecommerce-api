import prisma from "../config/prisma.js";

async function main() {
    let customerRole = await prisma.role.findFirst({
        where: {
            rolename: "Customer"
        }
    });

    if (!customerRole) {
        customerRole = await prisma.role.create({
            data: {
                rolename: "Customer"
            }
        });
    }

    let basicMembership = await prisma.membership.findFirst({
        where: {
            mname: "Basic"
        }
    });

    if (!basicMembership) {
        basicMembership = await prisma.membership.create({
            data: {
                mname: "Basic",
                score: 0
            }
        });
    }

    console.log("Role:", customerRole);
    console.log("Membership:", basicMembership);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect();
    });