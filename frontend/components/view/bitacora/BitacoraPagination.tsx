import { Button } from "@/components/ui/button"

interface BitacoraPaginationProps {
    currentPage: number
    totalPages: number
    setCurrentPage: (page: number) => void
}

const BitacoraPagination: React.FC<BitacoraPaginationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:space-y-0 md:items-center md:justify-between mt-4">
            <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </Button>
                <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => {
                        const pageNumber = i + 1;
                        if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                        ) {
                            return (
                                <Button
                                    key={pageNumber}
                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNumber)}
                                >
                                    {pageNumber}
                                </Button>
                            );
                        }
                        if (
                            (pageNumber === currentPage - 3 && currentPage > 4) ||
                            (pageNumber === currentPage + 3 && currentPage < totalPages - 3)
                        ) {
                            return (
                                <span key={pageNumber} className="px-2">
                                    ...
                                </span>
                            );
                        }
                        return null;
                    })}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    )
}

export default BitacoraPagination
