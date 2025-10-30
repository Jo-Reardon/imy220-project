import { connectDB, closeDB } from './config/database.js';
import User from './models/User.js';
import Project from './models/Project.js';
import CheckIn from './models/CheckIn.js';

async function seedDatabase() {
    try {
        const db = await connectDB();
        
        const userModel = new User(db);
        const projectModel = new Project(db);
        const checkInModel = new CheckIn(db);

        console.log('Clearing existing data...');
        await db.collection('users').deleteMany({});
        await db.collection('projects').deleteMany({});
        await db.collection('checkins').deleteMany({});
        await db.collection('activities').deleteMany({});
        await db.collection('discussions').deleteMany({}); // Added this line

        console.log('Creating users...');
        
        // User 1
        const user1 = await userModel.create({
            username: 'YounglingSlayer66',
            email: 'test@test.com',
            password: 'test1234',
            name: 'Jo Reardon',
            bio: "I don't push to production, I teleport."
        });

        // User 2
        const user2 = await userModel.create({
            username: 'CaptainPicode',
            email: 'captain@starfleet.com',
            password: 'engage123',
            name: 'Jean-Luc Picard',
            bio: 'Make it so.'
        });

        // User 3 - ADDED THIS
        const user3 = await userModel.create({
            username: 'luke_skycoder',
            email: 'luke@jedi.dev',
            password: 'force123',
            name: 'Luke Skywalker',
            bio: 'May the source be with you.'
        });

        // User 4 - ADDED THIS
        const user4 = await userModel.create({
            username: 'leia_orgit',
            email: 'leia@rebel.dev',
            password: 'hope123',
            name: 'Leia Organa',
            bio: 'Rebel leader and code organizer.'
        });

        // Make them friends
        await userModel.addFriend(user1._id.toString(), user2._id.toString());
        await userModel.addFriend(user2._id.toString(), user1._id.toString());
        await userModel.addFriend(user1._id.toString(), user3._id.toString());
        await userModel.addFriend(user3._id.toString(), user1._id.toString());

        console.log('Creating projects...');

        // Project 1
        const project1 = await projectModel.create({
            name: 'Starfield Sorter',
            description: 'A sorting algorithm for stellar data',
            ownerId: user1._id.toString(),
            languages: ['Python', 'DataStructures'],
            type: 'Algorithm',
            version: '1.0.0',
            files: [
                { name: 'main.py', content: 'print("Hello Universe")' },
                { name: 'sort.py', content: 'def bubble_sort(arr): pass' }
            ]
        });

        // Project 2
        const project2 = await projectModel.create({
            name: 'Starfleet Inventory Manager',
            description: 'Keeping the Enterprise stocked, one commit at a time',
            ownerId: user2._id.toString(),
            languages: ['JavaScript', 'React'],
            type: 'Web Application',
            version: '2.1.0',
            files: [
                { name: 'index.js', content: 'console.log("Engage!")' },
                { name: 'inventory.js', content: 'class Inventory {}' }
            ]
        });

        // Project 3 - ADDED THIS
        const project3 = await projectModel.create({
            name: 'Rebel Communication System',
            description: 'Secure communication platform for the Rebel Alliance',
            ownerId: user4._id.toString(),
            languages: ['TypeScript', 'Node.js', 'Encryption'],
            type: 'Web Application',
            version: '1.5.0',
            files: [
                { name: 'server.ts', content: '// Secure server code' },
                { name: 'encryption.js', content: '// Encryption utilities' }
            ]
        });

        console.log('Creating check-ins...');

        // Check-in 1
        await checkInModel.create({
            projectId: project1._id.toString(),
            userId: user1._id.toString(),
            username: user1.username,
            message: 'Initial commit - Added basic sorting structure',
            version: '1.0.0',
            filesChanged: ['main.py', 'sort.py']
        });

        // Check-in 2
        await checkInModel.create({
            projectId: project1._id.toString(),
            userId: user1._id.toString(),
            username: user1.username,
            message: 'Fixed the hyperspace jump bug in the sorting algorithm',
            version: '1.0.1',
            filesChanged: ['sort.py']
        });

        // Check-in 3
        await checkInModel.create({
            projectId: project2._id.toString(),
            userId: user2._id.toString(),
            username: user2.username,
            message: 'Refactored inventory management system',
            version: '2.1.0',
            filesChanged: ['inventory.js']
        });

        console.log('Creating discussions...');

        // Discussions for project 1 - FIXED (using defined users)
        await db.collection('discussions').insertMany([
            {
                projectId: project1._id.toString(),
                userId: user2._id.toString(),
                username: user2.username,
                message: 'Great work on the encryption! This will make our communications much more secure.',
                createdAt: new Date(Date.now() - 3600000 * 3) // 3 hours ago
            },
            {
                projectId: project1._id.toString(),
                userId: user3._id.toString(), // Now user3 is defined
                username: user3.username,
                message: 'Should we add voice chat functionality next?',
                createdAt: new Date(Date.now() - 3600000 * 1) // 1 hour ago
            },
            {
                projectId: project1._id.toString(),
                userId: user1._id.toString(),
                username: user1.username,
                message: 'Excellent idea! Let me start working on the WebRTC integration.',
                createdAt: new Date(Date.now() - 1800000) // 30 minutes ago
            }
        ]);

        // Discussions for project 2 - FIXED
        await db.collection('discussions').insertMany([
            {
                projectId: project2._id.toString(),
                userId: user1._id.toString(),
                username: user1.username,
                message: 'The navigation algorithms are impressive. How accurate are they?',
                createdAt: new Date(Date.now() - 7200000) // 2 hours ago
            },
            {
                projectId: project2._id.toString(),
                userId: user2._id.toString(),
                username: user2.username,
                message: 'Within 0.001% error margin for most calculations. I\'m quite pleased with the results.',
                createdAt: new Date(Date.now() - 5400000) // 1.5 hours ago
            }
        ]);

        // Discussions for project 3 - FIXED (using defined users and project)
        await db.collection('discussions').insertMany([
            {
                projectId: project3._id.toString(), // Now project3 is defined
                userId: user4._id.toString(), // Now user4 is defined
                username: user4.username,
                message: 'The security protocols look solid. Should we add two-factor authentication?',
                createdAt: new Date(Date.now() - 10800000) // 3 hours ago
            },
            {
                projectId: project3._id.toString(),
                userId: user3._id.toString(),
                username: user3.username,
                message: 'Great suggestion! I can help implement that.',
                createdAt: new Date(Date.now() - 9000000) // 2.5 hours ago
            }
        ]);

        console.log('✅ Database seeded successfully!');
        console.log('\nTest user credentials:');
        console.log('Email: test@test.com');
        console.log('Password: test1234');
        console.log('Email: captain@starfleet.com');
        console.log('Password: engage123');
        
        await closeDB();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();