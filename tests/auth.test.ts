import { describe, expect, it, beforeEach } from 'bun:test';
import { app } from '../index';
import { db } from '../src/db';
import { users, sessions } from '../src/db/schema';

const clearDatabase = async () => {
    await db.delete(sessions);
    await db.delete(users);
};

describe('Auth API', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    describe('POST /auth/register', () => {
        it('should register a user successfully', async () => {
            const res = await app.handle(
                new Request('http://localhost/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Test User',
                        email: 'test@example.com',
                        password: 'password123'
                    })
                })
            );

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.success).toBe(true);
            expect(data.data.name).toBe('Test User');
            expect(data.data.email).toBe('test@example.com');
        });

        it('should fail if name is too long', async () => {
            const res = await app.handle(
                new Request('http://localhost/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'A'.repeat(300),
                        email: 'test@example.com',
                        password: 'password123'
                    })
                })
            );

            expect(res.status).toBe(422);
        });

        it('should fail with invalid email', async () => {
            const res = await app.handle(
                new Request('http://localhost/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Test User',
                        email: 'invalid-email',
                        password: 'password123'
                    })
                })
            );

            expect(res.status).toBe(422);
        });

        it('should fail with duplicate email', async () => {
            // First registration
            await app.handle(
                new Request('http://localhost/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'User 1',
                        email: 'dup@example.com',
                        password: 'password123'
                    })
                })
            );

            // Second registration with same email
            const res = await app.handle(
                new Request('http://localhost/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'User 2',
                        email: 'dup@example.com',
                        password: 'password123'
                    })
                })
            );

            expect(res.status).toBe(400);
        });
    });

    describe('POST /auth/users/login', () => {
        beforeEach(async () => {
            // Pre-register a user for login tests
            await app.handle(
                new Request('http://localhost/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Login Test',
                        email: 'login@example.com',
                        password: 'password123'
                    })
                })
            );
        });

        it('should login successfully with correct credentials', async () => {
            const res = await app.handle(
                new Request('http://localhost/auth/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'login@example.com',
                        password: 'password123'
                    })
                })
            );

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.data).toBeDefined(); // token
        });

        it('should fail with wrong password', async () => {
            const res = await app.handle(
                new Request('http://localhost/auth/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'login@example.com',
                        password: 'wrongpassword'
                    })
                })
            );

            expect(res.status).toBe(401);
        });

        it('should fail with missing fields', async () => {
            const res = await app.handle(
                new Request('http://localhost/auth/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'login@example.com'
                    })
                })
            );

            expect(res.status).toBe(422);
        });
    });
});
