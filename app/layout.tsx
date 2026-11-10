import type { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: 'PrivacyGuard Kenya',
  description: 'A private workspace for reporting unwanted marketing and tracking your next step.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en-KE"><body><a className="skip" href="#content">Skip to content</a>{children}</body></html>;
}
