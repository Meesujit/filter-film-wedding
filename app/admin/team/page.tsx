import { requireRole } from "@/app/lib/auth-utils";
import { userService } from "@/app/lib/services/user-service";
import TeamManagementClient from "@/app/src/components/admin/team-management-client";


export default async function TeamManagementPage() {
  await requireRole(["admin"]);
  
  // Get only team members
  const teamMembers = await userService.getTeamMembers();
  const stats = await userService.getTeamStats();

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Team Management</h1>
        <p className="text-muted-foreground">
          Manage team members, assignments, attendance, and progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Members</p>
          <p className="text-2xl font-bold">{stats.totalMembers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Active Members</p>
          <p className="text-2xl font-bold">{stats.activeMembers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Assignments</p>
          <p className="text-2xl font-bold">{stats.totalAssignments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Avg Attendance</p>
          <p className="text-2xl font-bold">{stats.averageAttendance}</p>
        </div>
      </div>

      <TeamManagementClient initialTeam={teamMembers} />
    </div>
  );
}