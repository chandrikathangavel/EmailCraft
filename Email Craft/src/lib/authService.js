import bcrypt from 'bcryptjs';

// Simulate a network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const AUTH_DATA_KEY = 'email_craft_auth_data';
const USERS_DB_KEY = 'email_craft_users_db';

export const authService = {
    // Helper to get users from "DB"
    getUsers: () => {
        const users = localStorage.getItem(USERS_DB_KEY);
        return users ? JSON.parse(users) : [];
    },

    // Helper to save users to "DB"
    saveUsers: (users) => {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    },

    // Login function
    login: async (identifier, password) => {
        await delay(1000); // Simulate API latency

        if (!identifier || !password) {
            throw new Error('Please enter both email/username and password.');
        }

        const users = authService.getUsers();

        // Find user by email or username (case-insensitive for email, username exact match or logic could be added)
        // Assuming identifier is email for now as per requirements
        const user = users.find(u => u.email.toLowerCase() === identifier.toLowerCase());

        if (!user) {
            throw new Error('No account found with this email.');
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            throw new Error('Incorrect password. Please try again.');
        }

        // Create session object (exclude password hash)
        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        };

        // "Persist" session
        localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(sessionUser));

        return sessionUser;
    },

    // Signup function
    signup: async (name, email, password) => {
        await delay(1200);

        // Basic presence check
        if (!name || !email || !password) {
            throw new Error('All fields are required.');
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Please enter a valid email address.');
        }

        // Password complexity validation
        // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
        }

        const users = authService.getUsers();

        // Check if email already exists
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('An account with this email already exists.');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = {
            id: 'usr_' + Date.now(),
            name: name,
            email: email,
            passwordHash: passwordHash,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
        };

        // Save to "DB"
        users.push(newUser);
        authService.saveUsers(users);

        // Do NOT auto-login as per requirements (User should be redirected to login)
        // Returning the user object (without hash) for confirmation if needed
        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar
        };
    },

    // Check current session
    checkSession: async () => {
        await delay(500); // Quick check
        const data = localStorage.getItem(AUTH_DATA_KEY);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    },

    // Logout function
    logout: async () => {
        await delay(300);
        localStorage.removeItem(AUTH_DATA_KEY);
    },

    // Forgot Password (Mock implementation)
    resetPassword: async (email) => {
        await delay(1000);

        if (!email || !email.includes('@')) {
            throw new Error('Please enter a valid email address.');
        }

        const users = authService.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            throw new Error('No account found with this email.');
        }

        // Simulate sending email (success)
        return { success: true, message: 'Password reset link sent to your email.' };
    },

    // Google Login (Mock implementation - Kept just in case, though button is removed from UI)
    loginWithGoogle: async () => {
        await delay(1500); // Simulate OAuth popup/redirect delay

        // randomly fail to simulate "User cancellation" or "Network issue" (10% chance)
        if (Math.random() < 0.1) {
            throw new Error('Google Sign-In was cancelled.');
        }

        const user = {
            id: 'usr_google_' + Date.now(),
            name: 'Google User',
            email: 'user@gmail.com',
            avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c' // Generic Google-like avatar
        };

        localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(user));
        return user;
    },

    // Update Profile
    updateProfile: async (userId, updates) => {
        await delay(800);

        const users = authService.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('User not found.');
        }

        // Check email uniqueness if email is being updated
        if (updates.email && updates.email !== users[userIndex].email) {
            const emailExists = users.find(u => u.email.toLowerCase() === updates.email.toLowerCase() && u.id !== userId);
            if (emailExists) {
                throw new Error('Email already in use by another account.');
            }
        }

        // Update user in DB
        const updatedUser = { ...users[userIndex], ...updates };
        users[userIndex] = updatedUser;
        authService.saveUsers(users);

        // Update session if it matches the current user
        const sessionUser = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar
        };
        localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(sessionUser));

        return sessionUser;
    },

    // Change Password
    changePassword: async (userId, currentPassword, newPassword) => {
        await delay(1000);

        const users = authService.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('User not found.');
        }

        const user = users[userIndex];

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new Error('Incorrect current password.');
        }

        // Validate new password complexity
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            throw new Error('New password must match complexity requirements.');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // Update user
        users[userIndex].passwordHash = newPasswordHash;
        authService.saveUsers(users);

        return { success: true };
    },

    // Upload Avatar (Simulated)
    uploadAvatar: async (file) => {
        await delay(1500); // Simulate upload delay

        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('Only image files are allowed.');
        }

        // Validate file size (e.g., < 500KB for localStorage sake)
        if (file.size > 500 * 1024) {
            throw new Error('File size must be less than 500KB.');
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }
};
