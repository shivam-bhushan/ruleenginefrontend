export default function Navbar() {
    return (
        <nav className="absolute top-8 left-8 right-8 z-50 bg-white bg-opacity-30 backdrop-blur-md shadow-lg rounded-lg">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-extrabold text-white">
                            Eligibility<span className="text-white font-normal hover:text-blue-500">Checker</span>
                        </h1>
                    </div>
                    <div className="hidden sm:flex sm:items-center space-x-4">
                        <a href="/" className="text-gray-100 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </a>
                        <a href="/about" className="text-gray-100 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                            About
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
