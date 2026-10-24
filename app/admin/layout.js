// `absolute` skips the root layout's "%s · Rat City Homebrew Club" template.
export const metadata = {
  title: { absolute: 'Admin · Rat City Homebrew Club' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return children;
}
