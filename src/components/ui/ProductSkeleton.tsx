export default function ProductSkeleton() {
    return (
        <div className="flex flex-col animate-pulse">
            <div className="aspect-[3/4] bg-gray-100 mb-4" />
            <div className="h-3 w-3/4 bg-gray-100 mb-2" />
            <div className="h-3 w-1/4 bg-gray-100" />
        </div>
    );
}