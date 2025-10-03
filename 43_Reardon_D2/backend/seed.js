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

        // Make them friends
        await userModel.addFriend(user1._id.toString(), user2._id.toString());
        await userModel.addFriend(user2._id.toString(), user1._id.toString());

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

        console.log('✅ Database seeded successfully!');
        console.log('\nTest user credentials:');
        console.log('Email: test@test.com');
        console.log('Password: test1234');
        
        await closeDB();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();