const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const dns = require('dns');
const bcrypt = require('bcryptjs');

// Automatically bypass local DNS blocks by using Google DNS for SRV lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const Property = require('./backend/models/Property');
const User = require('./backend/models/User');

const seedDB = async () => {
    try {
        console.log('Connecting to database for seeding...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected! Clearing existing properties and users...');
        await Property.deleteMany({});
        await User.deleteMany({});

        // 1. Hash passwords
        const hashedAgentPassword = await bcrypt.hash('password123', 10);
        const hashedAdminPassword = await bcrypt.hash('Himanshu@2003', 10);

        // 2. Seed Users (Admin & Agents)
        console.log('Inserting Users...');
        const adminUser = await User.create({
            name: "RoyalPlots",
            email: "himanshumandal799@gmail.com",
            password: hashedAdminPassword,
            role: "admin",
            provider: "local",
            profileImage: "https://th.bing.com/th/id/OIP.GtglWCeSXElUU9f-1t9vQAHaE7?w=269&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
        });

        const agent1 = await User.create({
            name: "Himanshu Mandal",
            email: "himanshu@gmail.com",
            phone: "8541974985",
            phoneNumber: "8541974985",
            password: hashedAgentPassword,
            role: "agent",
            provider: "local",
            experience: 14,
            about: "Himanshu Mandal is a legendary acquisition strategist specializing in high-altitude and sub-surface retreats. With over 14 years of elite real estate depth across Uttarakhand and Rajasthan, he serves as a trusted advisor to top-tier investors seeking architectural icons.",
            location: "Roorkee, Uttarakhand",
            profileImage: "https://www.bing.com/th/id/OIP.rrhypC8v7bGwx0U1MTMHSwHaEJ?w=193&h=135&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
            socialLinks: {
                linkedin: "https://linkedin.com",
                twitter: "https://twitter.com",
                instagram: "https://instagram.com"
            }
        });

        const agent2 = await User.create({
            name: "Jaira Patel",
            email: "jaira.agent@gmail.com",
            phone: "9123456789",
            phoneNumber: "9123456789",
            password: hashedAgentPassword,
            role: "agent",
            provider: "local",
            experience: 8,
            about: "Jaira Patel is a premier real estate consultant with an emphasis on urban lofts and high-tech spaces. She blends technology and modern aesthetics to match clients with high-vibe residences.",
            location: "Indore, Madhya Pradesh",
            profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
            socialLinks: {
                linkedin: "https://linkedin.com",
                twitter: "https://twitter.com",
                instagram: "https://instagram.com"
            }
        });

        const agent3 = await User.create({
            name: "Vikram Rathore",
            email: "vikram.agent@gmail.com",
            phone: "9876123450",
            phoneNumber: "9876123450",
            password: hashedAgentPassword,
            role: "agent",
            provider: "local",
            experience: 10,
            about: "Vikram Rathore specializes in organic, heritage, and marine marvels. From floating cliffside suites to underwater pavilions in the Laccadive Sea, Vikram's bespoke portfolio satisfies the most adventurous connoisseurs of luxury.",
            location: "Bhopal, Madhya Pradesh",
            profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
            socialLinks: {
                linkedin: "https://linkedin.com",
                twitter: "https://twitter.com",
                instagram: "https://instagram.com"
            }
        });

        console.log('Users inserted successfully. Inserting Properties...');

        // 3. Properties array with Owner IDs
        const properties = [
            {
                title: "The Biosphere Oasis (Sub-surface Dome)",
                price: 18000000,
                location: "Thar Desert Sand Dunes, Rajasthan",
                bedrooms: 4,
                bathrooms: 5,
                area: "6,500",
                category: "buy",
                description: "A self-sustaining subterranean dome with a climate-controlled interior rainforest, recycled water streams, and solar-kinetic smart glass walls that display customizable holographic landscapes. Fully isolated from desert heat.",
                images: ["https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800"],
                owner: agent1._id,
                status: "Approved"
            },
            {
                title: "The Cloud-Nine Floating Suite",
                price: 28000,
                location: "Roorkee, Uttarakhand",
                bedrooms: 2,
                bathrooms: 2,
                area: "1,600",
                category: "rent",
                description: "A high-altitude, anti-gravity capsule home anchored to a Himalayan cliff side. Experience panoramic mountain vistas, low-density acoustic soundproofing, automated oxygen enrichment, and a heated glass-bottom deck.",
                images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
                owner: agent1._id,
                status: "Approved"
            },
            {
                title: "Atlantis Underwater Pavilion",
                price: 45000000,
                location: "Laccadive Sea, Lakshadweep",
                bedrooms: 5,
                bathrooms: 6,
                area: "8,200",
                category: "buy",
                description: "A hyperbaric marine manor situated 15 meters below sea level. Constructed using ultra-thick reinforced acrylic arches offering a 360-degree view of live coral reefs. Includes a private submarine dock and bioluminescent interior lighting.",
                images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"],
                owner: agent3._id,
                status: "Approved"
            },
            {
                title: "Neo-Cyberpunk Duplex Loft",
                price: 45000,
                location: "Cyber-Hub Sector 24, Gurugram",
                bedrooms: 1,
                bathrooms: 2,
                area: "1,100",
                category: "rent",
                description: "A sleek, neon-infused duplex loft with custom LED smart piping, voice-activated synthetic butler system, holographic wall projections, and a private drone-pad balcony overlooking the neon skyline.",
                images: ["https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800"],
                owner: agent2._id,
                status: "Approved"
            },
            {
                title: "Elven Hollow Treehouse",
                price: 9500000,
                location: "Silent Valley Forest, Kerala",
                bedrooms: 3,
                bathrooms: 3,
                area: "2,800",
                category: "buy",
                description: "A magical dwelling carved directly into a living giant Banyan tree. Blends organic wood structures with modern eco-technology, featuring glowing moss lighting, natural thermal ventilation, and a rope bridge leading to a private spring-fed pool.",
                images: ["https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800"],
                owner: agent3._id,
                status: "Approved"
            },
            {
                title: "The Obsidian Observatory",
                price: 25000,
                location: "Spiti Valley, Himachal Pradesh",
                bedrooms: 2,
                bathrooms: 2,
                area: "1,900",
                category: "rent",
                description: "An off-grid basalt-coated observatory home. Designed specifically for stargazing, it features an automated retractable carbon-fiber ceiling, custom high-aperture telescope, thermal floor heating, and absolute cellular signal isolation.",
                images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"],
                owner: agent2._id,
                status: "Approved"
            }
        ];

        await Property.insertMany(properties);
        console.log('✅ Seeding completed successfully!');
    } catch (err) {
        console.error('❌ Seeding Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected.');
    }
};

seedDB();
