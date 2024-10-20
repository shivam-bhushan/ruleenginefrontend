import EligibilityApp from '@/components/EligibilityApp';
import './globals.css'; // Ensure this imports your global styles
import Navbar from '@/components/Navbar';


export default function Home() {
  return (
    <div className="animated-bg h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="max-w-7xl mx-auto my-24">
        <EligibilityApp />
      </div>
    </div>
  );
}