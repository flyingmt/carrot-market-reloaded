export default function Home() {
  return (
    <main className="bg-gray-100 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 h-screen flex items-center justify-center p-5">
      <div
        className="
        bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col"
      >
        {['Nico', 'Me', 'You'].map((person, index) => (
          <div key={index}></div>
        ))}
      </div>
    </main>
  );
}
