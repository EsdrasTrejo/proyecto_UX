import ProtectedLayout from '@/components/layout/ProtectedLayout';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout>
      {children}
    </ProtectedLayout>
  );
}