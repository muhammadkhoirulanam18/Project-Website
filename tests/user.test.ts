import { describe, expect, it, beforeEach } from 'bun:test';
import { app } from '../index';
import { db } from '../src/db';
import { users, sessions } from '../src/db/schema';

const clearDatabase = async () => {
    await db.delete(sessions);
    await db.delete(users);
};

describe('User API', () => {
    let token: string;

    beforeEach(async () => {
        await clearDatabase();
        
        // Register and login to get a token
        await app.handle(
            new Request('http://localhost/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'API User',
                    email: 'api@example.com',
                    password: 'password123'
                })
            })
        );

        const loginRes = await app.handle(
            new Request('http://localhost/auth/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'api@example.com',
                    password: 'password123'
                })
            })
        );
        const loginData = await loginRes.json();
        token = loginData.data;
    });

    describe('GET /api/users/current', () => {
        it('should get current user with valid token', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/current', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            );

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.name).toBe('API User');
            expect(data.email).toBe('api@example.com');
        });

        it('should fail without token', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/current', {
                    method: 'GET'
                })
            );

            expect(res.status).toBe(401);
        });

        it('should fail with invalid token', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/current', {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer invalidtoken' }
                })
            );

            expect(res.status).toBe(401);
        });
    });

    describe('DELETE /api/users/logout', () => {
        it('should logout successfully', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/logout', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            );

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.data).toBe('OK');

            // Verify token is no longer valid
            const currentRes = await app.handle(
                new Request('http://localhost/api/users/current', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            );
            expect(currentRes.status).toBe(401);
        });

        it('should fail logout without token', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/logout', {
                    method: 'DELETE'
                })
            );

            expect(res.status).toBe(401);
        });
    });
});
