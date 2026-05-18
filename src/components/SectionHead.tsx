import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props {
  tag?: string;
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkLabel?: string;
}

export default function SectionHead({ tag, title, subtitle, linkTo, linkLabel = 'Lihat semua' }: Props) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
      <div>
        {tag && (
          <div className="text-xs font-bold uppercase tracking-[2px] text-brand-500 mb-2">
            {tag}
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-gray-500 mt-2 max-w-md">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:gap-2.5 transition-all"
        >
          {linkLabel}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
