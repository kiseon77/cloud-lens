import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  let startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, startPage + 5 - 1);
  startPage = Math.max(1, endPage - 5 + 1);

  const paginationItems = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <PaginationComponent>
      <PaginationContent>
        <PaginationPrevious
          onClick={() => handlePageChange(page - 1)}
          text=""
        />

        {paginationItems.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              onClick={() => handlePageChange(pageNumber)}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {page < totalPages - 3 && (
          <>
            <PaginationEllipsis />{" "}
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationNext onClick={() => handlePageChange(page + 1)} text="" />
      </PaginationContent>
    </PaginationComponent>
  );
}
