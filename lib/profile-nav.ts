/** Titles for /profile/[section] routes — used by Header and section pages. */
export const profileSectionTitles: Record<string, string> = {
  'edit-profile': 'Edit profile',
  'saved-travellers': 'Saved travellers',
  'payment-methods': 'Payment methods',
  'login-security': 'Login & security',
  'travel-preferences': 'Travel preferences',
  'my-coupons': 'My coupons',
  'wallet-rewards': 'Rewards',
  notifications: 'Notifications',
  'terms-conditions': 'Terms & conditions',
  'privacy-policy': 'Privacy policy',
  'app-info': 'App info',
};

export const profileSectionSlugs = Object.keys(profileSectionTitles);

export function getProfileSectionTitle(slug: string): string {
  return profileSectionTitles[slug] || 'Profile';
}
