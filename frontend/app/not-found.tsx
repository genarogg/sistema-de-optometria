const NotFound = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="mb-4 text-8xl font-bold text-gray-800">404</h1>
                <p className="mb-2 text-xl font-semibold text-gray-800">Page not found</p>
                <p className="mb-6 text-sm text-gray-500">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <a
                    href="/"
                    className="inline-block rounded-full bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
                >
                Go home
            </a>
        </div>
        </div >
    );
};

export default NotFound;