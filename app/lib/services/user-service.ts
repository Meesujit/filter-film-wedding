import { driveService } from '../google-drive';
import { User, UserRole } from '@/app/types/user';
import { v4 as uuidv4 } from 'uuid';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await driveService.getCollection<User>('users');
      console.log("All users from Drive:", users);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
      console.log(`User found for ${email}:`, user);
      return user || null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const user = users.find(user => user.id === id);
      console.log(`User found for ID ${id}:`, user);
      return user || null;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      return null;
    }
  },

  async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const users = await this.getAllUsers();
      return users.filter(user => user.role === role);
    } catch (error) {
      console.error("Error filtering users by role:", error);
      return [];
    }
  },

  async getTeamMembers(): Promise<User[]> {
    return this.getUsersByRole('team');
  },

  async getCustomers(): Promise<User[]> {
    return this.getUsersByRole('customer');
  },

  async getAdmins(): Promise<User[]> {
    return this.getUsersByRole('admin');
  },

  async createUser(userData: {
    email: string;
    name?: string;
    image?: string;
    role?: UserRole;
    teamProfile?: User['teamProfile'];
    customerProfile?: User['customerProfile'];
  }): Promise<User> {
    const users = await this.getAllUsers();
    
    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      return existingUser;
    }

    const newUser: User = {
      id: uuidv4(),
      email: userData.email,
      name: userData.name,
      image: userData.image,
      role: userData.role || 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add role-specific profile
    if (userData.role === 'team' && userData.teamProfile) {
      newUser.teamProfile = {
        assignment: [],
        progress: '0%',
        attendance: '100%',
        ...userData.teamProfile,
      };
    } else if (userData.role === 'customer' && userData.customerProfile) {
      newUser.customerProfile = {
        preferences: [],
        bookingHistory: [],
        ...userData.customerProfile,
      };
    }

    users.push(newUser);
    await driveService.saveCollection('users', users);
    
    return newUser;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return null;

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await driveService.saveCollection('users', users);
    return users[userIndex];
  },

  async updateUserRole(id: string, role: UserRole): Promise<User | null> {
    const user = await this.getUserById(id);
    if (!user) return null;

    const updates: Partial<User> = { role };

    // Initialize role-specific profile when role changes
    if (role === 'team' && !user.teamProfile) {
      updates.teamProfile = {
        assignment: [],
        progress: '0%',
        attendance: '100%',
      };
    } else if (role === 'customer' && !user.customerProfile) {
      updates.customerProfile = {
        preferences: [],
        bookingHistory: [],
      };
    }

    return this.updateUser(id, updates);
  },

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) return false;

    await driveService.saveCollection('users', filteredUsers);
    return true;
  },

  async verifyEmail(email: string): Promise<User | null> {
    const users = await this.getAllUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex === -1) return null;

    users[userIndex].emailVerified = new Date().toISOString();
    users[userIndex].updatedAt = new Date().toISOString();

    await driveService.saveCollection('users', users);
    return users[userIndex];
  },

  // Team-specific methods
  async updateTeamProfile(
    userId: string, 
    teamProfile: Partial<User['teamProfile']>
  ): Promise<User | null> {
    const user = await this.getUserById(userId);
    if (!user || user.role !== 'team') return null;

    const updatedProfile = {
      ...user.teamProfile,
      ...teamProfile,
    };

    return this.updateUser(userId, { teamProfile: updatedProfile });
  },

  async addAssignment(userId: string, assignment: string): Promise<User | null> {
    const user = await this.getUserById(userId);
    if (!user || user.role !== 'team') return null;

    const assignments = user.teamProfile?.assignment || [];
    assignments.push(assignment);

    return this.updateTeamProfile(userId, { assignment: assignments });
  },

  async removeAssignment(userId: string, assignmentIndex: number): Promise<User | null> {
    const user = await this.getUserById(userId);
    if (!user || user.role !== 'team') return null;

    const assignments = user.teamProfile?.assignment || [];
    assignments.splice(assignmentIndex, 1);

    return this.updateTeamProfile(userId, { assignment: assignments });
  },

  async updateAttendance(userId: string, attendance: string): Promise<User | null> {
    return this.updateTeamProfile(userId, { attendance });
  },

  async updateProgress(userId: string, progress: string): Promise<User | null> {
    return this.updateTeamProfile(userId, { progress });
  },

  // Customer-specific methods
  async updateCustomerProfile(
    userId: string,
    customerProfile: Partial<User['customerProfile']>
  ): Promise<User | null> {
    const user = await this.getUserById(userId);
    if (!user || user.role !== 'customer') return null;

    const updatedProfile = {
      ...user.customerProfile,
      ...customerProfile,
    };

    return this.updateUser(userId, { customerProfile: updatedProfile });
  },

  async addBooking(userId: string, bookingId: string): Promise<User | null> {
    const user = await this.getUserById(userId);
    if (!user || user.role !== 'customer') return null;

    const bookingHistory = user.customerProfile?.bookingHistory || [];
    bookingHistory.push(bookingId);

    return this.updateCustomerProfile(userId, { bookingHistory });
  },

  // Search and filter methods
  async searchUsers(query: string): Promise<User[]> {
    const users = await this.getAllUsers();
    const lowerQuery = query.toLowerCase();
    
    return users.filter(user => 
      user.name?.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery) ||
      user.teamProfile?.specialization?.toLowerCase().includes(lowerQuery) ||
      user.teamProfile?.bio?.toLowerCase().includes(lowerQuery)
    );
  },

  async getTeamMembersBySpecialization(specialization: string): Promise<User[]> {
    const teamMembers = await this.getTeamMembers();
    return teamMembers.filter(member => 
      member.teamProfile?.specialization?.toLowerCase().includes(specialization.toLowerCase())
    );
  },

  async getTeamMembersByDepartment(department: string): Promise<User[]> {
    const teamMembers = await this.getTeamMembers();
    return teamMembers.filter(member => 
      member.teamProfile?.department?.toLowerCase() === department.toLowerCase()
    );
  },

  // Statistics methods
  async getUserStats() {
    const users = await this.getAllUsers();
    
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      team: users.filter(u => u.role === 'team').length,
      customers: users.filter(u => u.role === 'customer').length,
      verified: users.filter(u => u.emailVerified).length,
      unverified: users.filter(u => !u.emailVerified).length,
    };
  },

  async getTeamStats() {
    const teamMembers = await this.getTeamMembers();
    
    const totalAssignments = teamMembers.reduce((sum, member) => 
      sum + (member.teamProfile?.assignment?.length || 0), 0
    );

    const avgAttendance = teamMembers.reduce((sum, member) => {
      const attendance = parseFloat(member.teamProfile?.attendance || '100');
      return sum + attendance;
    }, 0) / (teamMembers.length || 1);

    return {
      totalMembers: teamMembers.length,
      totalAssignments,
      averageAttendance: `${avgAttendance.toFixed(1)}%`,
      activeMembers: teamMembers.filter(m => 
        (m.teamProfile?.assignment?.length || 0) > 0
      ).length,
    };
  },
};