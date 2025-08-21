import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center text-center text-white bg-gray-900">
      <h1 className="text-9xl font-extrabold text-blue-400">404</h1>
      <h2 className="text-4xl font-bold mt-2">Page Not Found</h2>
      <p className="mt-4 text-lg text-gray-300">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
        Go to Homepage
      </Link>
    </div>
  );
}