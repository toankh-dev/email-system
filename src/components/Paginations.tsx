import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  total: number;
  nextPage?: () => void;
  previousPage?: () => void;
}
export default function BasePagination(props: PaginationProps) {
  const { pageIndex, pageSize, total, nextPage, previousPage } = props;

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <div className="text-muted-foreground px-3 py-1 text-sm select-none">
            {start}–{end} / {totalPages}
          </div>
        </PaginationItem>

        <PaginationItem onClick={previousPage}>
          <PaginationPrevious className="text-xl text-gray-500 [&>span]:hidden" />
        </PaginationItem>
        <PaginationItem onClick={nextPage}>
          <PaginationNext className="text-xl text-gray-500 [&>span]:hidden" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
