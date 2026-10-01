import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

export async function registerUser(username, fullname, password) {
    const existingUser = await prisma.user.findUnique({
        where: {
            username: username
        }
    });

    if (existingUser) {
        const error = new Error("Username already exists");
        error.statusCode = 409;
        throw error;
    }

    const role = await prisma.role.findFirst({
        where: {
            rolename: "Customer"
        }
    });

    const membership = await prisma.membership.findFirst({
        where: {
            mname: "Basic"
        }
    });

    if (!role || !membership) {
        const error = new Error("Default role or membership not found");
        error.statusCode = 500;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username: username,
            fullname: fullname,
            password: hashedPassword,
            roleid: role.roleid,
            mid: membership.mid
        }
    });

    return {
        uid: user.uid,
        username: user.username,
        fullname: user.fullname,
        roleid: user.roleid,
        mid: user.mid
    };
}
export async function loginUser(username, password) {
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    });

    if (!user) {
        const error = new Error("Invalid username or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        const error = new Error("Invalid username or password");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign({
            uid: user.uid,
            username: user.username,
            roleid: user.roleid
        },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h"
        }
    );

    return {
        token: token,
        user: {
            uid: user.uid,
            username: user.username,
            fullname: user.fullname,
            roleid: user.roleid,
            mid: user.mid
        }
    };
}