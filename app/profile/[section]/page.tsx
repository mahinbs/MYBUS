import { profileSectionSlugs } from '@/lib/profile-nav';
import ProfileSectionClient from './ProfileSectionClient';

export function generateStaticParams() {
  return profileSectionSlugs.map((section) => ({ section }));
}

export default function ProfileSectionPage() {
  return <ProfileSectionClient />;
}
