import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { type ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface Props {
  title: ReactNode;
  breadcrumb: BreadcrumbItem[];
}

export default function PageHeader({ title, breadcrumb }: Props) {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white py-12 sm:py-14 mb-8 relative overflow-hidden">
      <div className="absolute -top-1/2 -right-20 size-[500px] bg-brand-500/20 rounded-full blur-3xl" />
      <div className="container-x relative">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">{title}</h1>
        <nav className="flex items-center gap-1 text-sm text-gray-300">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5 text-gray-500" />}
              {item.to ? (
                <Link to={item.to} className="hover:text-brand-500 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
