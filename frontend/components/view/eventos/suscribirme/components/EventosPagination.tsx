import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface EventosPaginationProps {
    currentPage: number
    totalPages: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

const EventosPagination: React.FC<EventosPaginationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:space-y-0 md:items-center md:justify-between mt-4">
            <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    {/* <span className="hidden md:inline">Anterior</span> */}
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                >
                    {/* <span className="hidden md:inline">Siguiente</span> */}
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default EventosPagination