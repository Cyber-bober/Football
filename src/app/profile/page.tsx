/**
 * Profile page — personal cabinet.
 * Shows user photos, info, team, stats, contacts, and chat widget.
 * Requires authentication.
 */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/infrastructure/auth/authOptions';
import { PrismaUserRepository } from '@/infrastructure/database/repositories/PrismaUserRepository';
import { PrismaTeamRepository } from '@/infrastructure/database/repositories/PrismaTeamRepository';
import ProfileCard from '@/presentation/components/profile/ProfileCard';
import ChatWidget from '@/presentation/components/chat/ChatWidget';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <div>Please log in</div>;
  }

  const userRepo = new PrismaUserRepository();
  const teamRepo = new PrismaTeamRepository();
  const user = await userRepo.findById((session.user as any).id);

  if (!user) {
    return <div>User not found</div>;
  }

  let team = null;
  if (user.teamId) {
    team = await teamRepo.findById(user.teamId);
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <ProfileCard user={user} team={team} />
      <div style={{ marginTop: 40 }}>
        <h2>Чат</h2>
        <ChatWidget currentUserId={user.id} />
      </div>
    </div>
  );
}