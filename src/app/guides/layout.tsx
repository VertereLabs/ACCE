export default function GuidesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="guides-shell">{children}</div>;
}
